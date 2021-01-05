/* eslint-disable no-await-in-loop */
import normalizeUrl from 'normalize-url';
import low from 'lowdb';
import axios from 'axios';
import {
  sleep,
} from './index';

const FileSync = require('lowdb/adapters/FileSync');

const settingsAdapter = new FileSync('db/settings.json');
const dbs = low(settingsAdapter);

export const getMoviesFromRadarr = async (dbChoose) => {
  const adapter = new FileSync(`db/${dbChoose}.json`);
  const db = low(adapter);

  db.read();
  dbs.read();
  const settings = await dbs.get('settings').value();
  if (!settings || !settings.keyOmdb || !settings.radarrUrl || !settings.radarrApi
    || settings.deleteFiles === undefined || settings.addExclusion === undefined) {
    return {
      error: true,
      errors: [{
        msg: 'No settings',
      }],
      code: 400,
    };
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
      return {
        error: true,
        errors: [{
          msg: '404 NOT FOUND - Probably bad radarr link',
        }],
        code: 404,
      };
    }
    if (error && error.code === 'ETIMEDOUT') {
      return {
        error: true,
        errors: [{
          msg: error.code,
        }],
        code: 408,
      };
    }
    if (error && error.code === 'ENOTFOUND') {
      return {
        error: true,
        errors: [{
          msg: `456 NOT FOUND - Probably bad radarr link - ${error.code}`,
        }],
        code: 456,
      };
    }
    if (error && error.response && error.response.status === 401) {
      return {
        error: true,
        errors: [{
          msg: error.response.statusText,
        }],
        code: 401,
      };
    }
    return {
      error: true,
      errors: [{
        msg: 'Server Error - Getting Movies from Radarr',
      }],
      code: 500,
    };
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
  return {
    error: false,
    errors: [],
    code: 200,
  };
};

export const getRatingFromOmdb = async (req, dbChoose) => {
  const adapter = new FileSync(`db/${dbChoose}.json`);
  const db = low(adapter);
  const { io } = req.app.locals;
  db.read();
  dbs.read();
  const settings = await dbs.get('settings').value();
  if (!settings || !settings.keyOmdb || !settings.radarrUrl || !settings.radarrApi
    || settings.deleteFiles === undefined || settings.addExclusion === undefined) {
    return {
      error: true,
      errors: [{
        msg: 'No settings',
      }],
      code: 400,
    };
  }
  const { keyOmdb } = settings;
  console.log('Searching movies in OMDB...');
  const moviesFromDb = db.get('movies').value();
  console.log(`DB LENGTH ${moviesFromDb.length}`);
  let progress = 0;
  io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
      console.log('Client disconnected');
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
  return {
    error: false,
    errors: [],
    code: 200,
  };
};
