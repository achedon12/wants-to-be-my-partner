import {Body, Controller, Post} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {AuthService} from './auth.service';
import {UserService} from "../modules/user/user.service";
import {CreateUserDto} from "../modules/user/dto/create-user.dto";
import {LoginDto} from "./dto/login.dto";

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UserService) {
    }

    @Post('register')
    @ApiOperation({summary: 'Register a new user', description: 'Create a new user account with email and password'})
    @ApiResponse({status: 201, description: 'User registered successfully'})
    @ApiResponse({status: 400, description: 'Bad request - Email already exists or invalid data'})
    async register(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Post('login')
    @ApiOperation({summary: 'Login user', description: 'Authenticate user with email and password and return JWT token'})
    @ApiResponse({status: 200, description: 'Login successful - returns JWT token'})
    @ApiResponse({status: 401, description: 'Unauthorized - Invalid email or password'})
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}


