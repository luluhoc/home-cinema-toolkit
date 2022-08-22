import {
  Controller,
  Post,
  Get,
  HttpException,
  HttpStatus,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PostOmdb } from 'src/interfaces/omdb.module';
import { RatingService } from './rating.service';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Rating } from 'radarr';
import { SettingsGuard } from 'src/settings/settings.guard';

@Controller('movies')
@UseGuards(SettingsGuard)
export class RatingController {
  constructor(
    private ratingService: RatingService,
    private readonly redisService: RedisService,
  ) {}

  @Post('radarr')
  async getRating(): Promise<{
    error: boolean;
    errors: {
      msg: any;
    }[];
    code: number;
  }> {
    const movies = await this.ratingService.getMoviesFromRadarr();
    if (movies.error) {
      throw new HttpException(
        {
          status: movies.code,
          errors: movies.errors,
        },
        movies.code,
      );
    }
    return movies;
  }
  @Post()
  async postRating(@Body() body: PostOmdb): Promise<Rating[]> {
    const movies = await this.ratingService.getMoviesFromOmdb();
    if (movies.error) {
      throw new HttpException(
        {
          status: movies.code,
          errors: movies.errors,
        },
        movies.code,
      );
    }
    const desiredRating = Number(body.desiredRating);
    const { genre } = body;
    const client = this.redisService.getClient();
    const moviesf: Rating[] = await JSON.parse(await client.get('movies'));
    try {
      const returnedMovies = moviesf.filter(
        (movie) => movie.imdbRating <= desiredRating,
      );
      if (genre === 'None') {
        return returnedMovies;
      }
      const byGenre = returnedMovies.filter((e) => e.Genre.includes(genre));
      return byGenre;
    } catch (error) {
      throw new HttpException(
        {
          status: 500,
          error: [{ msg: 'Server Error' }],
        },
        500,
      );
    }
  }
  @Get('clear-db')
  async clear(): Promise<boolean> {
    const client = this.redisService.getClient();
    await client.del('movies');
    return true;
  }
}
