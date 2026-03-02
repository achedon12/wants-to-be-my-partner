import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInterestDto {
  @IsString()
  @ApiProperty({
    description: 'The name of the interest',
    example: 'Technology',
  })
  name: string;
}
