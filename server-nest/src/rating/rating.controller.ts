import { Controller, Post, Get } from '@nestjs/common';
import { RatingService } from './rating.service';

@Controller('rating')
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @Get('radarr')
  async getRating(): Promise<string> {
    const a: any = await this.ratingService.checkRedis();
    console.log(a);
    return a;
  }
}
