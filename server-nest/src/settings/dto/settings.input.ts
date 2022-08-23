import { Directive, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class SettingsInput {
  @Field({ nullable: false })
  keyOmdb: string;
  @Field({ nullable: false })
  radarrUrl: string;
  @Field({ nullable: false })
  radarrApi: string;
  @Field({ nullable: false })
  deleteFiles: boolean;
  @Field({ nullable: false })
  addExclusion: boolean;
  @Field({ nullable: false })
  v3: boolean;
}
