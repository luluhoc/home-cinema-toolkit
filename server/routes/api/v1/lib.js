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
const adapter = new FileSync('db/allMovies.json');
const db = low(adapter);
// SETTINGS
const settingsAdapter = new FileSync('db/settings.json');
const dbs = low(settingsAdapter);
// router
const router = express.Router();

router.get('/', async (req, res) => {
  db.read();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const obj = await getMoviesFromRadarr('allMovies');
  const objOm = await getRatingFromOmdb(req, 'allMovies');
  if (obj.error) {
    return res.status(obj.code).json({ errors: obj.errors });
  }
  if (objOm.error) {
    return res.status(obj.code).json({ errors: obj.errors });
  }
  const returnedMovies = db.get('movies').value();
  return res.json({ returnedMovies });
});

router.post('/whitelist', async (req, res) => {
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

  try {
    const m = await db.get('movies').value();
    if (!m) {
      return res.status(400).json({
        errors: [{
          msg: 'No movies',
        }],
      });
    }
    const { movie } = req.body;
    const mo = db.get('movies').find({ rId: movie }).value();
    let changed = {};
    if (mo && !mo.whitelist) {
      changed = await db.get('movies').find({ rId: movie }).assign({ whitelist: true }).write();
    }

    if (mo && mo.whitelist) {
      changed = await db.get('movies').find({ rId: movie }).assign({ whitelist: false }).write();
    }
    res.json({ movie: changed });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
