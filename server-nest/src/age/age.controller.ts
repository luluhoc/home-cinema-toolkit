import { RedisService } from '@liaoliaots/nestjs-redis';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SettingsGuard } from 'src/settings/settings.guard';
import { AgeService } from './age.service';

@Controller('by-age')
@UseGuards(SettingsGuard)
export class AgeController {
  constructor(
    private readonly redisService: RedisService,
    private readonly ageService: AgeService,
  ) {}

  @Post()
  async getByAge(@Body() body: { date: Date }) {
    const toRet = this.ageService.getMoviesByAge(body.date);
    return toRet;
  }
}
