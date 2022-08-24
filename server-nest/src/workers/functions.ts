/* eslint-disable no-loop-func */
import axios from 'axios';
import normalizeUrl from 'normalize-url';
import Redis from 'ioredis';
import { Rating } from 'src/rating/rating.model';
import { Settings } from 'src/interfaces/settings.module';
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const client = new Redis({
  host: 'localhost',
  port: 55001,
  password: 'redispw',
});
const getRadarrMovies = async () => {
  const settings = JSON.parse(await client.get('settings'));
  console.log(settings);
  if (
    !settings ||
    !settings.keyOmdb ||
    !settings.radarrUrl ||
    !settings.radarrApi ||
    settings.deleteFiles === undefined ||
    settings.addExclusion === undefined
  ) {
    console.error('Set the settings to run the job');
    return false;
  }
  const { radarrUrl, radarrApi, v3 } = settings;
  const apiUrl = normalizeUrl(
    `${radarrUrl}${v3 ? '/api/v3/movie' : '/api/movie'}`,
  );

  const radarrGet = {
    method: 'get',
    url: `${apiUrl}`,
    headers: {
      'User-Agent': 'request',
      'X-Api-Key': radarrApi,
    },
  };
  let movies;
  const m = await client.get('movies');
  if (!m) {
    await client.set('movies', '[]');
  }
  try {
    const moviesFromRadarr = await axios(radarrGet);
    movies = moviesFromRadarr.data;
    console.log('Got movies from radarr...');
  } catch (error) {
    console.log(error);
    if (error && error.response && error.response.status === 404) {
      return console.log('404 NOT FOUND - Probably bad radarr link');
    }
    if (error && error.code === 'ETIMEDOUT') {
      return console.log(error.code);
    }
    if (error && error.code === 'ENOTFOUND') {
      return console.log(
        `404 NOT FOUND - Probably bad radarr link - ${error.code}`,
      );
    }
    if (error && error.response && error.response.status === 401) {
      return console.log(error.response.statusText);
    }
    return console.log('Server Error - Getting Movies from Radarr');
  }

  const alreadyInDb: Rating[] = JSON.parse(await client.get('movies'));
  for (let index = 0; index < movies.length; index += 1) {
    if (movies[index].imdbId) {
      const a = alreadyInDb.findIndex((a) => a.rId === movies[index].id);
      if (a === -1) {
        const movie = {
          title: movies[index].title,
          rId: movies[index].id,
          imdbId: movies[index].imdbId,
        };
        // eslint-disable-next-line no-await-in-loop
        alreadyInDb.push(movie);
      }
    }
  }
  await client.set('movies', JSON.stringify(alreadyInDb));
  movies = null;
  return true;
};

exports.deleteByRating = async (variable) => {
  const start = new Date().getTime();
  const rad = await getRadarrMovies();
  if (!rad) {
    return;
  }
  const settings: Settings = JSON.parse(
    await client.get('settings'),
  ) as unknown as Settings;
  if (
    !settings ||
    !settings.keyOmdb ||
    !settings.radarrUrl ||
    !settings.radarrApi
  ) {
    return console.log('NO SETTINGS');
  }
  const desiredRating = Number(variable);
  console.log('Searching movies in OMDB...');
  const moviesFromDb: Rating[] = JSON.parse(await client.get('movies'));
  console.log(`DB LENGTH ${moviesFromDb.length}`);
  for (let index = 0; index < moviesFromDb.length; index += 1) {
    const diff = 43800;
    const a = moviesFromDb[index];
    // eslint-disable-next-line no-await-in-loop
    const func = async () => {
      await sleep(1);
      const d = await axios(
        `http://www.omdbapi.com/?apikey=${settings.keyOmdb}&i=${moviesFromDb[index].imdbId}`,
      );
      let b = 0;
      if (d && d.data && d.data.imdbVotes) {
        b = parseFloat(d.data.imdbVotes.replace(/,/g, ''));
      }
      if (!d) {
        return;
      }
      Object.assign(
        moviesFromDb,
        moviesFromDb.map((el) =>
          el.imdbId === d.data.imdbRating
            ? {
                ...el,
                imdbVotes: b,
                imdbRating: +d.data.imdbRating,
                Poster: d.data.pos,
                expires: new Date(new Date().getTime() + diff * 60000),
              }
            : el,
        ),
      );
    };
    try {
      if (a && !a.expires) {
        await func();
      } else if (a && Date.parse(a.expires) < new Date().getTime()) {
        await func();
      } else {
        continue;
      }
    } catch (error) {
      console.log(error);
      if (error.code === 'ECONNRESET') {
        // eslint-disable-next-line no-await-in-loop
        const d = await axios(
          `http://www.omdbapi.com/?apikey=${settings.keyOmdb}&i=${moviesFromDb[index].imdbId}`,
        );
        // eslint-disable-next-line no-await-in-loop
        Object.assign(
          moviesFromDb,
          moviesFromDb.map((el) =>
            el.imdbId === d.data.imdbRating
              ? {
                  ...el,
                  imdbVotes: b,
                  imdbRating: +d.data.imdbRating,
                  Poster: d.data.pos,
                  expires: new Date(new Date().getTime() + diff * 60000),
                }
              : el,
          ),
        );
      }
    }
  }
  await client.set('movies', JSON.stringify(moviesFromDb));
  console.log('Sending movies to Frontend');
  try {
    const returnedMovies = await dbsch
      .get('movies')
      .filter((movie) => movie.imdbRating <= desiredRating)
      .value();
    const promisesDelete = [];
    console.log(`Deleting ${returnedMovies.length} movies`);
    for (let index = 0; index < returnedMovies.length; index += 1) {
      const apiUrl = normalizeUrl(
        `${settings.radarrUrl}${settings.v3 ? '/api/v3/movie' : '/api/movie'}/${
          returnedMovies[index].rId
        }?deleteFiles=${settings.deleteFiles}&${
          settings.v3 ? 'addImportExclusion=' : 'addExclusion='
        }${settings.addExclusion}`,
      );
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
        promisesDelete.push(del);
        await db
          .get('movies')
          .remove({ rId: returnedMovies[index].rId })
          .write();
      } catch (error) {
        console.log(error);
        if (error.code === 'ECONNRESET') {
          const del = await axios(options);
          return promises.push(del);
        }

        return console.log('error Delete');
      }
    }
    const deleted = await Promise.all(promisesDelete);
    const end = new Date().getTime();
    const time = end - start;
    await db
      .get('jobs')
      .find({
        jobType: 'rating',
      })
      .assign({
        exTime: time,
        lastEx: new Date(),
        deleted: deleted.length,
      })
      .write();
    console.log(deleted.length);
  } catch (error) {
    console.log(error);
  }
};
