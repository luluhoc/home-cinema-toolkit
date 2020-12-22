/* eslint-disable no-loop-func */
import express from 'express';
import axios from 'axios';
import normalizeUrl from 'normalize-url';
import low from 'lowdb';
import {
  check,
  validationResult,
} from 'express-validator';
import {
  sleep,
} from '../../../helpers/index';
import { getMoviesFromRadarr } from '../../../helpers/functions';
// DB CONFIG
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db/rating.json');
const db = low(adapter);

const settingsAdapter = new FileSync('db/settings.json');
const dbs = low(settingsAdapter);
// router
const router = express.Router();
// @route POST api/movies/
// @desc FIND MOVIES
// @access Public for users
router.post('/radarr', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const obj = await getMoviesFromRadarr();
  if (obj && obj.error) {
    return res.status(obj.code).json({ errors: obj.errors });
  }
  return res.json({ success: true });
});

// @route POST api/movies/
// @desc FIND MOVIES
// @access Public for users
router.post('/', [
  check('desiredRating', 'Desired Rating can\'t be empty').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { io } = req.app.locals;
  db.read();
  dbs.read();
  const settings = await dbs.get('settings').value();
  if (!settings || !settings.keyOmdb || !settings.radarrUrl || !settings.radarrApi
    || settings.deleteFiles === undefined || settings.addExclusion === undefined) {
    return res.status(400).json({
      errors: [{
        msg: 'No settings',
      }],
    });
  }
  const { keyOmdb } = settings;
  const desiredRating = Number(req.body.desiredRating);
  console.log('Searching movies in OMDB...');
  const moviesFromDb = db.get('movies').value();
  console.log(`DB LENGTH ${moviesFromDb.length}`);
  let progress = 0;
  io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
      console.log('Client disconnected');
      return res.status(500).json({
        errors: [{
          msg: 'Server Error - ended on disconnect',
        }],
      });
    });
  });
  const oneMovieProgress = 100 / moviesFromDb.length;
  const diff = 43800;
  const func = async (m) => {
    await sleep(1);
    const d = await axios(`http://www.omdbapi.com/?apikey=${keyOmdb}&i=${m}`);
    let b = 0;
    if (!d) {
      console.error('Error with response from OMDB');
      return;
    }
    if (d.data && d.data.imdbVotes) {
      b = parseFloat(d.data.imdbVotes.replace(/,/g, ''));
    }
    let g = [];
    if (d.data && d.data.Genre) {
      g = d.data.Genre.split(',').map((item) => item.trim());
    }
    let i = 0;
    if (d.data && d.data.imdbID) {
      i = d.data.imdbID;
    }
    let rat = 0;
    if (d.data && d.data.imdbRating) {
      rat = d.data.imdbRating;
    }
    let pos = '';
    if (d.data && d.data.Poster) {
      pos = d.data.Poster;
    }

    await db.get('movies')
      .find({
        imdbId: i,
      })
      .assign({
        imdbVotes: b,
        imdbRating: rat,
        Genre: g,
        Poster: pos,
        expires: new Date(new Date().getTime() + diff * 60000),
      })
      .write();
    io.emit('FromAPI', d.data.Title);
    progress += oneMovieProgress;
    io.emit('Progress', progress);
  };
  for (let index = 0; index < moviesFromDb.length; index += 1) {
    const a = moviesFromDb[index];
    try {
      if (a && !a.expires) {
        // eslint-disable-next-line no-await-in-loop
        await func(a.imdbId);
      } else if (a && Date.parse(a.expires) < new Date()) {
        // eslint-disable-next-line no-await-in-loop
        await func(a.imdbId);
      } else {
        continue;
      }
    } catch (error) {
      console.log(error);
      if (error.code === 'ECONNRESET') {
        await func(a.imdbId);
      }
    }
  }
  console.log('Sending movies to Frontend');
  try {
    const returnedMovies = db.get('movies').filter((movie) => movie.imdbRating <= desiredRating);
    return res.json({
      returnedMovies,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errors: [{
        msg: 'Server Error - Sending To FrontEnd',
      }],
    });
  }
});

// @route POST api/movies/delete
// @desc DELETE MOVIES
// @access Public for users

router.post('/delete',
  async (req, res) => {
    dbs.read();
    db.read();
    const settings = await dbs.get('settings').value();
    if (!settings || !settings.keyOmdb || !settings.radarrUrl || !settings.radarrApi
      || settings.deleteFiles === undefined || settings.addExclusion === undefined) {
      return res.status(400).json({
        errors: [{
          msg: 'No settings',
        }],
      });
    }
    const {
      selectedArr,
    } = req.body;
    const promises = [];
    console.log(`Deleting ${selectedArr.length} movies`);
    for (let index = 0; index < selectedArr.length; index += 1) {
      const apiUrl = normalizeUrl(`${settings.radarrUrl}${settings.v3 ? '/api/v3/movie' : '/api/movie'}/${selectedArr[index]}?deleteFiles=${settings.deleteFiles}&${settings.v3 ? 'addImportExclusion=' : 'addExclusion='}${settings.addExclusion}`);
      const options = {
        method: 'DELETE',
        url: apiUrl,
        headers: {
          'User-Agent': 'request',
          'X-Api-Key': settings.radarrApi,
        },
      };
      try {
        const del = await axios(options);
        promises.push(del);
        await db.get('movies').remove({ rId: selectedArr[index] }).write();
      } catch (error) {
        console.log(error);
        if (error.code === 'ECONNRESET') {
          const del = await axios(options);
          return promises.push(del);
        }

        return res.status(500).json({
          errors: [{
            msg: 'Server Error - Delete',
          }],
        });
      }
    }
    return res.json({
      deleted: promises.length,
    });
  });

router.get('/clear-db', async (req, res) => {
  db.read();
  try {
    db.set('movies', []).write();
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errors: [{
        msg: 'Server Error - Clearing DB',
      }],
    });
  }
});

module.exports = router;
