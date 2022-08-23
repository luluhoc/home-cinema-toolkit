import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'rating' })
export class Rating {
  @Field({ nullable: true })
  title: string;
  @Field({ nullable: true })
  rId: number;
  @Field({ nullable: true })
  imdbId: string;
  @Field({ nullable: true })
  imdbVotes?: number;
  @Field({ nullable: true })
  imdbRating?: number;
  @Field({ nullable: true })
  Genre?: string;
  @Field({ nullable: true })
  Poster?: string;
  @Field({ nullable: true })
  expires?: string;
}
@ObjectType({ description: 'ratingFirstStepd' })
class ErrorsArr {
  @Field({ nullable: true })
  msg: string;
}

@ObjectType({ description: 'ratingFirstStep' })
export class RatingFirstStep {
  @Field({ nullable: true })
  error: boolean;
  @Field((type) => [ErrorsArr])
  errors: ErrorsArr[];
  @Field({ nullable: true })
  code: number;
}
