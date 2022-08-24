import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TasksResolver]
})
export class TasksModule {}
