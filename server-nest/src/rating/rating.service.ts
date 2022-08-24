import { Injectable, Logger } from '@nestjs/common';
import { Rating, RootObject } from 'radarr';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Settings } from 'src/interfaces/settings.module';
import axios from 'axios';
import { Server } from 'socket.io';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RatingException } from './rating.exception';

const importDynamic = Function('return import("normalize-url")')() as Promise<
  typeof import('normalize-url')
>;
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeUrl = async (...args: any[]) => {
  const module = await importDynamic;
  // @ts-ignore
  return module.default(...args);
};

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RatingService {
  private readonly ratings: RootObject[] = [];

  constructor(
    private readonly redisService: RedisService,
    private readonly logger: Logger,
  ) {}

  async checkRedis() {
    const client = await this.redisService.getClient();
    await client.set('test', JSON.stringify([{ test: { a: 'b' } }]));
    const json = await client.get('test');
    return json;
  }
  @WebSocketServer()
  server: Server;

  async getMoviesFromRadarr() {
    const client = await this.redisService.getClient();
    const settings: Settings = JSON.parse(
      await client.get('settings'),
    ) as unknown as Settings;

    const { radarrUrl, radarrApi, v3 } = settings;
    const apiUrl = await normalizeUrl(
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
      this.logger.log('Got movies from radarr...');
    } catch (error) {
      this.logger.error(error);
      if (error && error.response && error.response.status === 404) {
        return new RatingException(
          404,
          '404 NOT FOUND - Probably bad radarr link',
        );
      }
      if (error && error.code === 'ETIMEDOUT') {
        return {
          error: true,
          errors: [
            {
              msg: error.code,
            },
          ],
          code: 408,
        };
      }
      if (error && error.code === 'ENOTFOUND') {
        return {
          error: true,
          errors: [
            {
              msg: `456 NOT FOUND - Probably bad radarr link - ${error.code}`,
            },
          ],
          code: 456,
        };
      }
      if (error && error.response && error.response.status === 401) {
        return {
          error: true,
          errors: [
            {
              msg: error.response.statusText,
            },
          ],
          code: 401,
        };
      }
      return {
        error: true,
        errors: [
          {
            msg: 'Server Error - Getting Movies from Radarr',
          },
        ],
        code: 500,
      };
    }
    // add types

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
    return {
      error: false,
      errors: [],
      code: 200,
    };
  }
  @SubscribeMessage('events')
  async getMoviesFromOmdb() {
    const client = await this.redisService.getClient();
    const io = this.server;
    // const s = await client.get('settings');
    // const settings: Settings = {
    //   keyOmdb: 'thewdb',
    //   radarrUrl: 'localhost:7878/',
    //   radarrApi: '2389bdc157804ac1a1e0c6aa5516d100',
    //   deleteFiles: true,
    //   addExclusion: true,
    //   v3: true,
    // };

    const settings: Settings = JSON.parse(
      await client.get('settings'),
    ) as unknown as Settings;
    const { keyOmdb } = settings;
    this.logger.log('Searching movies in OMDB...');
    const moviesFromDb: Rating[] = JSON.parse(await client.get('movies'));

    this.logger.log(`DB LENGTH ${moviesFromDb.length}`);
    let progress = 0;
    // io.on('connection', (socket) => {
    //   console.log('New client connected');
    //   socket.on('disconnect', () => {
    //     console.log('Client disconnected');
    //   });
    // });
    const oneMovieProgress = 100 / moviesFromDb.length;
    const diff = 43800;
    const func = async (m) => {
      await sleep(1);
      const d = await axios(`http://www.omdbapi.com/?apikey=${keyOmdb}&i=${m}`);
      let b = 0;
      if (!d) {
        this.logger.error('Error with response from OMDB');
        return;
      }
      if (d.data && d.data.imdbVotes) {
        b = parseFloat(d.data.imdbVotes.replace(/,/g, ''));
      }
      let g = [];
      if (d.data && d.data.Genre) {
        g = d.data.Genre.split(',').map((item) => item.trim());
      }
      let i = '';
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
      Object.assign(
        moviesFromDb,
        moviesFromDb.map((el) =>
          el.imdbId === i
            ? {
                ...el,
                imdbVotes: b,
                imdbRating: +rat,
                Genre: g,
                Poster: pos,
                expires: new Date(new Date().getTime() + diff * 60000),
              }
            : el,
        ),
      );

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
        } else if (a && Date.parse(a.expires) < new Date().getTime()) {
          // eslint-disable-next-line no-await-in-loop
          await func(a.imdbId);
        } else {
          continue;
        }
      } catch (error) {
        this.logger.error(error);
        if (error.code === 'ECONNRESET') {
          await func(a.imdbId);
        }
      }
    }
    await client.set('movies', JSON.stringify(moviesFromDb));
    return {
      error: false,
      errors: [],
      code: 200,
    };
  }
  async getRatingMovies(
    rating: string,
    g: string,
  ): Promise<Rating[] | RatingException> {
    const movies = await this.getMoviesFromOmdb();
    if (movies instanceof RatingException) {
      return movies;
    }
    const desiredRating = +rating;
    const genre = g;
    const client = this.redisService.getClient();
    const moviesFromRedis: Rating[] = await JSON.parse(
      await client.get('movies'),
    );
    try {
      const returnedMovies = moviesFromRedis.filter(
        (movie) => movie.imdbRating <= desiredRating,
      );
      if (genre === 'None') {
        return returnedMovies;
      }
      const byGenre = returnedMovies.filter((e) => e.Genre.includes(genre));
      return byGenre;
    } catch (error) {
      throw new RatingException(500, 'Error During Filtering');
    }
  }
  async deleteMovies(selectedArr: number[]) {
    const client = await this.redisService.getClient();
    // const s = await client.get('settings');
    // const settings: Settings = {
    //   keyOmdb: 'thewdb',
    //   radarrUrl: 'localhost:7878/',
    //   radarrApi: '2389bdc157804ac1a1e0c6aa5516d100',
    //   deleteFiles: true,
    //   addExclusion: true,
    //   v3: true,
    // };

    const settings: Settings = JSON.parse(
      await client.get('settings'),
    ) as unknown as Settings;
    const movies: Rating[] = JSON.parse(await client.get('movies'));
    const promises = [];
    this.logger.log(`Deleting ${selectedArr.length} movies`);
    for (let index = 0; index < selectedArr.length; index += 1) {
      const apiUrl = await normalizeUrl(
        `${settings.radarrUrl}${settings.v3 ? '/api/v3/movie' : '/api/movie'}/${
          selectedArr[index]
        }?deleteFiles=${settings.deleteFiles}&${
          settings.v3 ? 'addImportExclusion=' : 'addExclusion='
        }${settings.addExclusion}`,
      );
      try {
        const del = await axios.delete(apiUrl, {
          headers: {
            'User-Agent': 'request',
            'X-Api-Key': settings.radarrApi,
          },
        });
        promises.push(del);
      } catch (error) {
        this.logger.error(error);
        if (error.code === 'ECONNRESET') {
          const del = await axios(apiUrl, {
            headers: {
              'User-Agent': 'request',
              'X-Api-Key': settings.radarrApi,
            },
          });
          return promises.push(del);
        }

        return new RatingException(500, 'Server Error');
      }
    }
    const newMovies = movies.filter(
      (i) => !selectedArr.some((j) => j === i.rId),
    );
    await client.set('movies', JSON.stringify(newMovies));
    return {
      deleted: promises.length,
    };
  }
}
