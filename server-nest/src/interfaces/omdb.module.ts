import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PostOmdb {
  @ApiProperty()
  @IsNotEmpty()
  desiredRating: number;
  @ApiProperty()
  @IsNotEmpty()
  genre: string;
}
