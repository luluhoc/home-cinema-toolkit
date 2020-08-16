import express from 'express';
import request from 'request';
import rp from 'request-promise';
import low from 'lowdb';

import normalizeUrl from 'normalize-url';

const FileSync = require('lowdb/adapters/FileSync');

const keys = require('../config/settings');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({
  movies: [],
  count: 0,
})
  .write();

require('dotenv').config();

const router = express.Router();

router.get('/', async (req, res) => {
  res.render('index');
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

router.post('/find-movies', async (req, res) => {
  process.nextTick(async () => {
    console.log('Start');
    const {
      radarrUrl,
    } = req.body;
    const {
      radarrApi,
    } = req.body;
    const {
      keyOmdb,
    } = req.body;
    const desiredRating = Number(req.body.desiredRating); // all the movies below and equal to this rating are gonna be deleted
    const radarrGet = {
      uri: `${radarrUrl}`,
      headers: {
        'User-Agent': 'request',
        'X-Api-Key': radarrApi,
      },
    };
    let movies;
    const moviesOmdb = [];
    db.unset('movies').write();
    db.set('movies', []).write();

    try {
      const moviesFromRadarr = await rp(radarrGet);
      movies = await JSON.parse(moviesFromRadarr);
      console.log('Got movies from radarr...');
    } catch (error) {
      return res.json(error);
    }
    for (let index = 0; index < movies.length; index++) {
      if (movies[index].imdbId) {
        const movie = {
          title: movies[index].title,
          rId: movies[index].id,
          imdbId: movies[index].imdbId,
        };
        db.get('movies')
          .push(movie)
          .write();
      }
    }
    let data;
    try {
      console.log('Searching movies in OMDB...');
      const moviesFromDb = db.get('movies').value();
      const promises = [];
      for (let index = 0; index < moviesFromDb.length; index++) {
        await sleep(10);
        promises.push(rp(`http://www.omdbapi.com/?apikey=${keyOmdb}&i=${moviesFromDb[index].imdbId}`));
      }
      console.log('Waiting for OMDB');
      data = await Promise.all(promises);
      console.log('Parsing Data from OMDB');
    } catch (error) {
      return res.json(error);
    }

    for (let index = 0; index < data.length; index++) {
      const parsed = JSON.parse(data[index]);
      moviesOmdb.push(parsed);
    }

    console.log('Sending movies to Frontend');
    try {
      for (let index = 0; index < moviesOmdb.length; index++) {
        db.get('movies')
          .find({
            imdbId: moviesOmdb[index].imdbID,
          })
          .assign({
            imdbVotes: moviesOmdb[index].imdbVotes,
            imdbRating: moviesOmdb[index].imdbRating,
            Poster: moviesOmdb[index].Poster,
          })
          .write();
      }
      const returnedMovies = db.get('movies').filter((movie) => movie.imdbRating <= desiredRating);
      return res.json({
        returnedMovies,
      });
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  });
});

router.post('/delete-movies', async (req, res) => {
  const {
    radarrApi, addExclusion, deleteFiles, selectedArr, radarrUrl,
  } = req.body;
  try {
    const promises = [];
    console.log(`Deleting ${selectedArr.length} movies`);
    for (let index = 0; index < selectedArr.length; index++) {
      const createUrl = `${radarrUrl}/${selectedArr[index]}?deleteFiles=${deleteFiles}&addExclusion=${addExclusion}`;
      console.log(createUrl);
      const options = {
        method: 'DELETE',
        uri: createUrl,
        headers: {
          'User-Agent': 'request',
          'X-Api-Key': radarrApi,
        },
      };
      promises.push(rp(options));
    }
    const deleted = await Promise.all(promises);
    res.json(deleted);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

module.exports = router;
