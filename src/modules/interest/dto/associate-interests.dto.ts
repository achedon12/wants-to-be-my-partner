import { IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AssociateInterestsDto {
  @Type(() => Number)
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({
    description: 'Array of interest IDs to associate with the user',
    example: [1, 2, 3],
    type: [Number],
  })
  interestIds: number[];
}

