import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Settings {
  @ApiProperty({
    description: 'https://www.omdbapi.com/apikey.aspx - API key for OMDb',
    minimum: 1,
  })
  @IsNotEmpty()
  keyOmdb: string;
  @ApiProperty()
  radarrUrl: string;
  @ApiProperty()
  radarrApi: string;
  @ApiProperty()
  deleteFiles: boolean;
  @ApiProperty()
  addExclusion: boolean;
  @ApiProperty()
  v3: boolean;
}
