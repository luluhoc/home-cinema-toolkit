import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RatingService } from './rating/rating.service';
import { RatingController } from './rating/rating.controller';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { SettingsController } from './settings/settings.controller';
import { SettingsService } from './settings/settings.service';
import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 49156,
        password: 'redispw',
        enableReadyCheck: true,
        onClientCreated(client) {
          client.on('error', (err) => {
            console.log(err);
            console.log('Closing Server');
            return process.exit(0);
          });
          client.on('ready', () => console.log('Redis is ready'));
        },
      },
    }),
    TerminusModule,
    RedisHealthModule,
  ],
  controllers: [AppController, RatingController, SettingsController],
  providers: [AppService, RatingService, SettingsService],
})
export class AppModule {}
