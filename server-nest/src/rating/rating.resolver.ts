import {
  Controller,
  Post,
  Get,
  HttpException,
  HttpStatus,
  Body,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { DeleteArr, PostOmdb } from 'src/interfaces/omdb.module';
import { RatingService } from './rating.service';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { SettingsGuard } from 'src/settings/settings.guard';
import { RatingException } from './rating.exception';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Rating, RatingFirstStep } from './rating.model';
import { RatingInput } from './dto/rating.input';

@Resolver((of) => Rating)
@UseGuards(SettingsGuard)
export class RatingResolver {
  constructor(
    private ratingService: RatingService,
    private readonly redisService: RedisService,
    private readonly logger: Logger,
  ) {}

  @Query((returns) => RatingFirstStep)
  async getRating(): Promise<RatingFirstStep> {
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
  @Mutation((returns) => [Rating])
  async getRatingFinal(
    @Args('ratingInput') ratingInput: RatingInput,
  ): Promise<Rating[] | RatingException> {
    const returnMovies = this.ratingService.getRatingMovies(
      ratingInput.desiredRating,
      ratingInput.genre,
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
  // @Post('delete')
  // async del(@Body() body: DeleteArr) {
  //   const deleted = this.ratingService.deleteMovies(body.selectedArr);
  //   return deleted;
  // }
  // @Get('clear-db')
  // async clear(): Promise<boolean> {
  //   const client = this.redisService.getClient();
  //   await client.del('movies');
  //   return true;
  // }
}
