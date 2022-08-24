import { Injectable } from '@nestjs/common';
import { TasksInput } from './dto/tasks.input';
import { RatingException } from '../rating/rating.exception';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ITasks } from './dto/tasks.model';

@Injectable()
export class TasksService {
  constructor(private readonly redisService: RedisService) {}
  async addTask({ jobType, time, variable }: TasksInput) {
    if (jobType && jobType === 'byAge') {
      return new RatingException(404, 'This is not yet supported');
    }
    if (jobType && (jobType === 'rating' || jobType === 'byAge')) {
      try {
        const client = this.redisService.getClient();
        await client.setnx('tasks', JSON.stringify([]));
        const tasks: ITasks[] = JSON.parse(await client.get('tasks'));
        console.log(tasks);
        const checkIfJobExists = tasks.findIndex((e) => e.jobType === jobType);

        if (checkIfJobExists > -1) {
          tasks[checkIfJobExists] = {
            time,
            jobType,
            variable,
            on: true,
          };
        } else {
          tasks.push({
            time,
            jobType,
            variable,
            on: true,
          });
        }
        await client.set('tasks', JSON.stringify(tasks));
        return tasks;
      } catch (error) {
        console.log(error);
        return new RatingException(500, 'Server Error - Adding JOBS');
      }
    }
  }
}
