const axios = require('axios');
const normalizeUrl = require('normalize-url');
const low = require('lowdb');

const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db/jobs.json');
const db = low(adapter);

const scheduleAdapter = new FileSync('db/schedule.json');
const dbsch = low(scheduleAdapter);

const settingsAdapter = new FileSync('db/settings.json');
const dbs = low(settingsAdapter);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.deleteByRating = async (variable) => {
  const start = new Date().getTime();
  dbs.read()
  db.read()
  const settings = await dbs.get('settings').value();
  console.log(settings)
  if (!settings || !settings.keyOmdb || !settings.radarrUrl || !settings.radarrApi) {
    return console.log('NO SETTINGS')
  }
  const apiUrl = normalizeUrl(`${settings.radarrUrl}${settings?.v3 ? '/api/v3/movie' : '/api/movie'}`)
  const desiredRating = Number(variable);

  const radarrGet = {
    method: 'get',
    url: `${apiUrl}`,
    headers: {
      'User-Agent': 'request',
      'X-Api-Key': settings.radarrApi,
    },
  };

  let movies;
  const moviesOmdb = [];
  dbsch.unset('movies').write();
  dbsch.set('movies', []).write();

  try {
    const moviesFromRadarr = await axios(radarrGet);
    movies = moviesFromRadarr.data;
    console.log('Got movies from radarr...');
  } catch (error) {
    console.log(error);
  }

  for (let index = 0; index < movies.length; index++) {
    if (movies[index].imdbId) {
      const movie = {
        title: movies[index].title,
        rId: movies[index].id,
        imdbId: movies[index].imdbId,
      };
      await dbsch.get('movies')
        .push(movie)
        .write();
    }
  }

  let data;
  try {
    console.log('Searching movies in OMDB...');
    const moviesFromDb = await dbsch.get('movies').value();
    const promises = [];
    for (let index = 0; index < moviesFromDb.length; index++) {
      await sleep(10);
      promises.push(axios(`http://www.omdbapi.com/?apikey=${settings.keyOmdb}&i=${moviesFromDb[index].imdbId}`));
    }
    console.log('Waiting for OMDB');
    data = await Promise.all(promises);
    console.log('Parsing Data from OMDB');
  } catch (error) {
    console.log(error);
  }

  for (let index = 0; index < data.length; index++) {
    moviesOmdb.push(data[index].data);
  }
  try {
    for (let index = 0; index < moviesOmdb.length; index++) {
      dbsch.get('movies')
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
    console.log(desiredRating)
    const returnedMovies = await dbsch.get('movies').filter((movie) => movie.imdbRating <= desiredRating).value();
    console.log(returnedMovies)
    const promisesDelete = [];
    const deleteFiles = true;
    const addExclusion = true;
    console.log(`Deleting ${returnedMovies.length} movies`);
    for (let index = 0; index < returnedMovies.length; index++) {
      const apiUrl = normalizeUrl(`${settings.radarrUrl}${settings?.v3 ? '/api/v3/movie' : '/api/movie'}/${returnedMovies[index].rId}?deleteFiles=${deleteFiles}&${settings?.v3 ? 'addImportExclusion=' : 'addExclusion='}${addExclusion}`)
      const options = {
        method: 'DELETE',
        url: apiUrl,
        headers: {
          'User-Agent': 'request',
          'X-Api-Key': settings.radarrApi,
        },
      };
      promisesDelete.push(axios(options));
    }
    const deleted = await Promise.all(promisesDelete);
    const end = new Date().getTime();
    const time = end - start;
    await db.get('jobs').find({
      jobType: 'rating'
    }).assign({
      exTime: time,
      lastEx: new Date(),
      deleted: deleted.length
    }).write()
    console.log(deleted.length);
    dbsch.unset('movies').write();
  } catch (error) {
    console.log(error);
  }
}