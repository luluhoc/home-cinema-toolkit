import { Directive, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class RatingInput {
  @Field({ nullable: false })
  desiredRating: string;
  @Field({ nullable: false })
  genre: string;
}
