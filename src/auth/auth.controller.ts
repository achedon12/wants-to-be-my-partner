import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from './auth.service';
import {UserService} from "../modules/user/user.service";
import {CreateUserDto} from "../modules/user/dto/create-user.dto";
import {LoginDto} from "./dto/login.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UserService) {
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
