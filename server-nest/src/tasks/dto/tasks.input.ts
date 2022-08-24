import { Directive, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Time } from './tasks.model';

@InputType()
export class TasksInput {
  @Field({ nullable: false })
  @ApiProperty()
  jobType: string;
  @ApiProperty()
  @Field(() => Time, { nullable: false })
  time: Time;
  @ApiProperty()
  @Field({ nullable: false })
  variable: string;
}
