import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RatingService } from './rating/rating.service';
import { RatingController } from './rating/rating.controller';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { SettingsController } from './settings/settings.controller';
import { SettingsService } from './settings/settings.service';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 49154,
        password: 'redispw',
      },
    }),
  ],
  controllers: [AppController, RatingController, SettingsController],
  providers: [AppService, RatingService, SettingsService],
})
export class AppModule {}
