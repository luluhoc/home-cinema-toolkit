import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Settings } from 'src/interfaces/settings.module';
import axios from 'axios';
import { RatingException } from '../rating/rating.exception';
import { RootObject } from 'radarr';
const importDynamic = Function('return import("normalize-url")')() as Promise<
  typeof import('normalize-url')
>;
const normalizeUrl = async (...args: any[]) => {
  const module = await importDynamic;
  // @ts-ignore
  return module.default(...args);
};

@Injectable()
export class AgeService {
  constructor(private readonly redisService: RedisService) {}
  async getMoviesByAge(date: Date) {
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
    let movies: RootObject[];
    try {
      const moviesFromRadarr = await axios(radarrGet);
      movies = moviesFromRadarr.data;
      const a = movies.filter((m) => m.added < date);
      const newArr = a.sort(
        (a, b) => new Date(a.added).getTime() - new Date(b.added).getTime(),
      );
      return { movies: newArr };
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        return new RatingException(401, error.response.statusText);
      }
      return new RatingException(401, 'Server Error');
    } finally {
      movies = null;
    }
  }
}
