import express from 'express';
import axios from 'axios';
import normalizeUrl from 'normalize-url';
import low from 'lowdb';
// DB CONFIG

const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db/byAge.json');
const db = low(adapter);

// router
const router = express.Router();

(function () {
  if (typeof Object.defineProperty === 'function') {
    try { Object.defineProperty(Array.prototype, 'sortBy', { value: sb }); } catch (e) {}
  }
  if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

  function sb(f) {
    for (var i = this.length; i;) {
      const o = this[--i];
      this[i] = [].concat(f.call(o, o, i), o);
    }
    this.sort((a, b) => {
      for (let i = 0, len = a.length; i < len; ++i) {
        if (a[i] != b[i]) return a[i] < b[i] ? -1 : 1;
      }
      return 0;
    });
    for (var i = this.length; i;) {
      this[--i] = this[i][this[i].length - 1];
    }
    return this;
  }
}());

router.post('/', async (req, res) => {
  db.read();
  console.log('Start');
  const {
    radarrUrl, radarrApi, v3, date,
  } = req.body;
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
  db.unset('movies').write();
  db.set('movies', []).write();

  try {
    const moviesFromRadarr = await axios(radarrGet);
    movies = moviesFromRadarr.data;
    const a = movies.filter((m) => m.added < date);
    const newArr = a.sortBy((o) => o.added);
    res.json({ movies: newArr });
    movies = null;
  } catch (error) {
    console.log(error);
    if (error.response.status === 401) {
      return res.status(401).json({ errors: [{ msg: error.response.statusText }] });
    }
    return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
  console.log('Sending movies to Frontend');
});

router.post('/diskspace', async (req, res) => {
  db.read();
  console.log('Start');
  const {
    radarrUrl, radarrApi, v3,
  } = req.body;
  const apiUrl = normalizeUrl(`${radarrUrl}${v3 ? '/api/v3/diskspace' : '/api/diskspace'}`);

  const radarrGet = {
    method: 'get',
    url: `${apiUrl}`,
    headers: {
      'User-Agent': 'request',
      'X-Api-Key': radarrApi,
    },
  };

  try {
    const diskspace = await axios(radarrGet);

    console.log(diskspace);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
  console.log('Sending movies to Frontend');
});

module.exports = router;
