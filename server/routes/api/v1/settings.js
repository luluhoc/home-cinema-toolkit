import express from 'express';
import axios from 'axios';
import normalizeUrl from 'normalize-url';
import low from 'lowdb';

// DB CONFIG
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

// router
const router = express.Router();

// @route POST api/settings/
// @desc Set Settings
// @access Public for users
router.post('/', async (req, res) => {
  const {
    radarrUrl, radarrApi, keyOmdb, v3
  } = req.body;

  try {
    db.read();
    const settings = db.set('settings', {
      radarrUrl,
      radarrApi,
      keyOmdb,
      v3
    }).write();
    console.log(settings)
    res.json(settings);
  } catch (error) {
    console.log(error);
  }
})

// @route GET api/settings/
// @desc Get Settings
// @access Public for users
router.get('/', async (req, res) => {

  try {
    db.read();
    const settings = db.get('settings').value();
    if (settings) {
      return res.json(settings);
    }
    res.json(null);
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;