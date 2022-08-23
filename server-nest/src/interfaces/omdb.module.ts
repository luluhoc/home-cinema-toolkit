import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PostOmdb {
  @ApiProperty()
  @IsNotEmpty()
  desiredRating: string;
  @ApiProperty()
  @IsNotEmpty()
  genre: string;
}

export class DeleteArr {
  @ApiProperty()
  @IsNotEmpty()
  selectedArr: number[];
}
