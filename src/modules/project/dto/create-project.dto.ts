import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @IsString()
  @ApiProperty({
    description: 'The name of the project',
    example: 'E-commerce Platform',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'The description of the project',
    example: 'An innovative e-commerce platform for small businesses',
  })
  description: string;

  @IsNumber()
  @ApiProperty({
    description: 'The budget of the project',
    example: 100000,
  })
  budget: number;

  @IsString()
  @ApiProperty({
    description: 'The category of the project',
    example: 'Technology',
  })
  category: string;
}
