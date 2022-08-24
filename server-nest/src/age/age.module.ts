import { Module, Logger } from '@nestjs/common';
import { AgeController } from './age.controller';
import { AgeService } from './age.service';

@Module({
  controllers: [AgeController],
  providers: [AgeService, Logger],
})
export class AgeModule {}
