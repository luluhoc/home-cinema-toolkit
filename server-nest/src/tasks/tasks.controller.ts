import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpException,
  Get,
} from '@nestjs/common';
import { TasksInput } from './dto/tasks.input';
import { TasksService } from './tasks.service';
import { RatingException } from '../rating/rating.exception';
import { SettingsGuard } from 'src/settings/settings.guard';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ITasks } from './dto/tasks.model';

@Controller('tasks')
@UseGuards(SettingsGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly redisService: RedisService,
  ) {}
  @Post()
  async addTask(@Body() body: TasksInput) {
    const tasks = this.tasksService.addTask(body);
    if (tasks instanceof RatingException) {
      throw new HttpException(
        {
          status: tasks.error,
          errors: tasks.errors,
        },
        tasks.code,
      );
    }
    return tasks;
  }
  @Get()
  async getTasks() {
    const client = this.redisService.getClient();
    const tasks: ITasks = JSON.parse(await client.get('tasks'));
    return tasks;
  }
}
