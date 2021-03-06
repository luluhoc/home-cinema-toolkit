/* eslint-disable no-loop-func */
import express from 'express';
import axios from 'axios';
import normalizeUrl from 'normalize-url';
import low from 'lowdb';
import {
  check,
  validationResult,
} from 'express-validator';
import { getMoviesFromRadarr, getRatingFromOmdb } from '../../../helpers/functions';
// DB CONFIG
const FileSync = require('lowdb/adapters/FileSync');
// RATING
const adapter = new FileSync('db/rating.json');
const db = low(adapter);
// SETTINGS
const settingsAdapter = new FileSync('db/settings.json');
const dbs = low(settingsAdapter);
// WHITELIST
// SETTINGS
const whiteListAdapter = new FileSync('db/whitelist.json');
const white = low(whiteListAdapter);

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
  const obj = await getMoviesFromRadarr('rating');
  if (obj.error) {
    return res.status(obj.code).json({ errors: obj.errors });
  }
  return res.json({ success: true });
});

// @route POST api/movies/
// @desc FIND MOVIES
// @access Public for users

router.post('/', [
  check('desiredRating', 'Desired Rating can\'t be empty').not().isEmpty(),
  check('genre', 'Genre can\'t be empty').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const obj = await getRatingFromOmdb(req, 'rating');
  if (obj.error) {
    return res.status(obj.code).json({ errors: obj.errors });
  }
  const desiredRating = Number(req.body.desiredRating);
  const { genre } = req.body;
  db.read();
  console.log('Sending movies to Frontend');
  try {
    const returnedMovies = await db.get('movies').filter((movie) => movie.imdbRating <= desiredRating).value();
    if (genre === 'None') {
      return res.json({
        returnedMovies,
      });
    }
    const byGenre = returnedMovies.filter((e) => e.Genre.includes(genre));
    return res.json({
      returnedMovies: byGenre,
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

// @route POST api/movies/whitelist
// @desc Whitelist
// @access Public for users

router.post('/whitelist', async (req, res) => {
  dbs.read();
  db.read();
  white.read();
  const settings = await dbs.get('settings').value();
  if (!settings || !settings.keyOmdb || !settings.radarrUrl || !settings.radarrApi
      || settings.deleteFiles === undefined || settings.addExclusion === undefined) {
    return res.status(400).json({
      errors: [{
        msg: 'No settings',
      }],
    });
  }

  try {
    const m = await white.get('whitelist').value();
    if (!m) {
      await white.set('whitelist', []).write();
    }
    const { movie } = req.body;
    const whiteList = await white.get('whitelist').value();
    const newArr = whiteList.filter((f) => f !== movie).concat([movie]);
    await white.set('whitelist', newArr).write();
    res.json({ newArr });
  } catch (error) {
    console.log(error);
  }
});

// @route GET api/movies/clear-db
// @desc Clear DB
// @access Public for users

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
