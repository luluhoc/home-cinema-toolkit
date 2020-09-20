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

// @route POST api/movies/
// @desc FIND MOVIES
// @access Public for users
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

router.post('/', async (req, res) => {
  db.defaults({
    movies: [],
    count: 0,
  })
    .write();
  console.log('Start');
  const {
    radarrUrl, radarrApi, keyOmdb,
  } = req.body;

  const desiredRating = Number(req.body.desiredRating);

  const radarrGet = {
    method: 'get',
    url: `${radarrUrl}`,
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
    const moviesFromRadarr = await axios(radarrGet);
    movies = moviesFromRadarr.data;
    console.log('Got movies from radarr...');
  } catch (error) {
    console.log(error);
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
      promises.push(axios(`http://www.omdbapi.com/?apikey=${keyOmdb}&i=${moviesFromDb[index].imdbId}`));
    }
    console.log('Waiting for OMDB');
    data = await Promise.all(promises);
    console.log('Parsing Data from OMDB');
  } catch (error) {
    console.log(error);
    return res.json(error);
  }

  for (let index = 0; index < data.length; index++) {
    moviesOmdb.push(data[index].data);
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

// @route POST api/movies/delete
// @desc DELETE MOVIES
// @access Public for users

router.post('/delete', async (req, res) => {
  const {
    radarrApi, addExclusion, deleteFiles, selectedArr, radarrUrl,
  } = req.body;
  try {
    const promises = [];
    console.log(`Deleting ${selectedArr.length} movies`);
    for (let index = 0; index < selectedArr.length; index++) {
      const createUrl = `${radarrUrl}/${selectedArr[index]}?deleteFiles=${deleteFiles}&addExclusion=${addExclusion}`;
      const url = normalizeUrl(createUrl);
      const options = {
        method: 'DELETE',
        url: url,
        headers: {
          'User-Agent': 'request',
          'X-Api-Key': radarrApi,
        },
      };
      promises.push(axios(options));
    }
    const deleted = await Promise.all(promises);
    res.json({ deleted: deleted.length });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});


module.exports = router;
