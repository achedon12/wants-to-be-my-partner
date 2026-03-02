import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({description: 'The email of the user', example: 'email.test.com'})
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({description: 'The password of the user', example: 'password123'})
    password: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({description: 'The first name of the user', example: 'John'})
    firstname: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({description: 'The last name of the user', example: 'Doe'})
    lastname: string;
}
