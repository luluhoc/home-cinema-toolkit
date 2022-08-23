import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'settings' })
export class Settings {
  @Field({ nullable: false })
  keyOmdb: string;
  @Field({ nullable: false })
  radarrUrl: string;
  @Field({ nullable: false })
  radarrApi: string;
  @Field()
  deleteFiles: boolean;
  @Field()
  addExclusion: boolean;
  @Field()
  v3: boolean;
}
