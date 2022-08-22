import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';
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

  constructor(private readonly redisService: RedisService) {}

  async checkRedis() {
    const client = await this.redisService.getClient();
    await client.set('test', JSON.stringify([{ test: { a: 'b' } }]));
    const json = await client.get('test');
    console.log(json); // [{"a":1}]
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
      console.log('Got movies from radarr...');
    } catch (error) {
      console.log(error);
      if (error && error.response && error.response.status === 404) {
        return {
          error: true,
          errors: [
            {
              msg: '404 NOT FOUND - Probably bad radarr link',
            },
          ],
          code: 404,
        };
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
          await alreadyInDb.push(movie);
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
    if (
      !settings ||
      !settings.keyOmdb ||
      !settings.radarrUrl ||
      !settings.radarrApi ||
      settings.deleteFiles === undefined ||
      settings.addExclusion === undefined
    ) {
      return {
        error: true,
        errors: [
          {
            msg: 'No settings',
          },
        ],
        code: 400,
      };
    }
    const { keyOmdb } = settings;
    console.log('Searching movies in OMDB...');
    const moviesFromDb: Rating[] = JSON.parse(await client.get('movies'));

    console.log(`DB LENGTH ${moviesFromDb.length}`);
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
        console.log(error);
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
}
