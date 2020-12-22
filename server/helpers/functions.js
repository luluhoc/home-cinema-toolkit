/* eslint-disable no-await-in-loop */
import normalizeUrl from 'normalize-url';
import low from 'lowdb';
import axios from 'axios';

const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db/rating.json');
const db = low(adapter);

const settingsAdapter = new FileSync('db/settings.json');
const dbs = low(settingsAdapter);

export const getMoviesFromRadarr = async () => {
  db.read();
  dbs.read();
  const settings = await dbs.get('settings').value();
  if (!settings || !settings.keyOmdb || !settings.radarrUrl || !settings.radarrApi
    || settings.deleteFiles === undefined || settings.addExclusion === undefined) {
    return {
      error: true,
      msg: 'No settings',
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

export const getRatingFromOmdb = () => {

};
