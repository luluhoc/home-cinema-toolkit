import { Logger, Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingResolver } from './rating.resolver';
import { RatingService } from './rating.service';
@Module({
  controllers: [RatingController],
  providers: [RatingResolver, RatingService, Logger],
})
export class RatingModule {}
