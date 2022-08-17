import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';
import { Rating, RootObject } from 'radarr';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Settings } from 'src/interfaces/settings.module';
import axios from 'axios';

const importDynamic = Function('return import("normalize-url")')() as Promise<
  typeof import('normalize-url')
>;

const normalizeUrl = async (...args: any[]) => {
  const module = await importDynamic;
  // @ts-ignore
  return module.default(...args);
};

@Injectable()
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
  async getMoviesFromRadarr() {
    const client = await this.redisService.getClient();
    const s = await client.get('settings');
    const settings: Settings = {
      keyOmdb: 'wdb',
      radarrUrl: 'localhost:7878/',
      radarrApi: '2389bdc157804ac1a1e0c6aa5516d100',
      deleteFiles: true,
      addExclusion: true,
      v3: true,
    };
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
      client.set('movies', '[]');
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
}
