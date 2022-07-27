import { Controller, Get, Post } from '@nestjs/common';

@Controller('movies')
export class RatingController {
  @Post('radarr')
  getMovies(): string {
    return 'This action returns all cats';
  }
}
