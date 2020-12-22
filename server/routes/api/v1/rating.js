/* eslint-disable no-loop-func */
import express from 'express';
import axios from 'axios';
import normalizeUrl from 'normalize-url';
import low from 'lowdb';
import moment from 'moment';
import {
  check,
  validationResult,
} from 'express-validator';
import {
  sleep,
} from '../../../helpers/index';
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
  const {
    radarrUrl, radarrApi, v3,
  } = settings;
  const apiUrl = normalizeUrl(`${radarrUrl}${v3 ? '/api/v3/movie' : '/api/movie'}`);

  const radarrGet = {
    method: 'get',
    url: `${apiUrl}`,
    headers: {
      'User-Agent': 'request',
      'X-Api-Key': radarrApi,
    },
  };

  let movies;
  const m = await db.get('movies').value();
  if (!m) {
    db.set('movies', []).write();
  }
  try {
    const moviesFromRadarr = await axios(radarrGet);
    movies = moviesFromRadarr.data;
    console.log('Got movies from radarr...');
  } catch (error) {
    console.log(error);
    if (error && error.response && error.response.status === 404) {
      return res.status(404).json({
        errors: [{
          msg: '404 NOT FOUND - Probably bad radarr link',
        }],
      });
    }
    if (error && error.code === 'ETIMEDOUT') {
      return res.status(408).json({
        errors: [{
          msg: error.code,
        }],
      });
    }
    if (error && error.code === 'ENOTFOUND') {
      return res.status(404).json({
        errors: [{
          msg: `404 NOT FOUND - Probably bad radarr link - ${error.code}`,
        }],
      });
    }
    if (error && error.response && error.response.status === 401) {
      return res.status(401).json({
        errors: [{
          msg: error.response.statusText,
        }],
      });
    }
    return res.status(500).json({
      errors: [{
        msg: 'Server Error - Getting Movies from Radarr',
      }],
    });
  }

  for (let index = 0; index < movies.length; index += 1) {
    if (movies[index].imdbId) {
      const a = await db.get('movies').find({
        rId: movies[index].id,
      }).value();
      if (!a) {
        const movie = {
          title: movies[index].title,
          rId: movies[index].id,
          imdbId: movies[index].imdbId,
        };
        // eslint-disable-next-line no-await-in-loop
        await db.get('movies')
          .push(movie)
          .write();
      }
    }
  }
  movies = null;
  res.json({ success: true });
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
  for (let index = 0; index < moviesFromDb.length; index += 1) {
    const diff = 43800;
    const a = moviesFromDb[index];
    // eslint-disable-next-line no-await-in-loop
    const func = async () => {
      await sleep(1);
      const d = await axios(`http://www.omdbapi.com/?apikey=${keyOmdb}&i=${moviesFromDb[index].imdbId}`);
      let b = 0;
      if (d && d.data && d.data.imdbVotes) {
        b = parseFloat(d.data.imdbVotes.replace(/,/g, ''));
      }
      if (!d) {
        return;
      }
      await db.get('movies')
        .find({
          imdbId: d.data.imdbID,
        })
        .assign({
          imdbVotes: b,
          imdbRating: d.data.imdbRating,
          Poster: d.data.Poster,
          expires: new Date(new Date().getTime() + diff * 60000),
        })
        .write();
      io.emit('FromAPI', d.data.Title);
      progress += oneMovieProgress;
      io.emit('Progress', progress);
    };
    try {
      if (a && !a.expires) {
        await func();
      } else if (a && Date.parse(a.expires) < new Date()) {
        await func();
      } else {
        continue;
      }
    } catch (error) {
      console.log(error);
      if (error.code === 'ECONNRESET') {
        // eslint-disable-next-line no-await-in-loop
        const d = await axios(`http://www.omdbapi.com/?apikey=${keyOmdb}&i=${moviesFromDb[index].imdbId}`);
        // eslint-disable-next-line no-await-in-loop
        await db.get('movies')
          .find({
            imdbId: d.data.imdbID,
          })
          .assign({
            imdbVotes: d.data.imdbVotes,
            imdbRating: d.data.imdbRating,
            Poster: d.data.Poster,
            expires: new Date(new Date().getTime() + diff * 60000),
          })
          .write();
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
