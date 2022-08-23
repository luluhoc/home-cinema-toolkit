import {
  Controller,
  Post,
  Get,
  HttpException,
  HttpStatus,
  Body,
  UseGuards,
} from '@nestjs/common';
import { DeleteArr, PostOmdb } from 'src/interfaces/omdb.module';
import { RatingService } from './rating.service';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Rating } from 'radarr';
import { SettingsGuard } from 'src/settings/settings.guard';
import { RatingException } from './rating.exception';

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
  async postRating(
    @Body() body: PostOmdb,
  ): Promise<Rating[] | RatingException> {
    const returnMovies = this.ratingService.getRatingMovies(
      body.desiredRating,
      body.genre,
    );
    if (returnMovies instanceof RatingException) {
      throw new HttpException(
        {
          status: returnMovies.error,
          errors: returnMovies.errors,
        },
        returnMovies.code,
      );
    }
    return returnMovies;
  }
  @Post('delete')
  async del(@Body() body: DeleteArr) {
    const deleted = this.ratingService.deleteMovies(body.selectedArr);
    return deleted;
  }
  @Get('clear-db')
  async clear(): Promise<boolean> {
    const client = this.redisService.getClient();
    await client.del('movies');
    return true;
  }
}
