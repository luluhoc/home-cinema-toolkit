import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export class Settings {
  @ApiProperty({
    description: 'https://www.omdbapi.com/apikey.aspx - API key for OMDb',
    minimum: 1,
  })
  @IsNotEmpty()
  @Field({ nullable: false })
  keyOmdb: string;
  @ApiProperty()
  @Field({ nullable: false })
  radarrUrl: string;
  @ApiProperty()
  @Field({ nullable: false })
  radarrApi: string;
  @ApiProperty()
  deleteFiles: boolean;
  @ApiProperty()
  addExclusion: boolean;
  @ApiProperty()
  v3: boolean;
}
