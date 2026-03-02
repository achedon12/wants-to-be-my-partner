import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CryptoService } from '../shared/services/crypto.service';
import { UserService } from '../modules/user/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private cryptoService: CryptoService,
    private userService: UserService,
  ) {}

  generateToken(role: string): string {
    return this.cryptoService.generateToken(role);
  }

  async hashPassword(password: string): Promise<string> {
    return this.cryptoService.hashPassword(password);
  }

  async passwordVerify(password: string, hashedPassword: string): Promise<boolean> {
    return this.cryptoService.passwordVerify(password, hashedPassword);
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userService.findByEmail(loginDto.email);
      const isPasswordValid = await this.userService.validatePassword(loginDto.password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const token = this.generateToken(user.role);

      return {
        message: 'User logged in successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
        },
      };
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new UnauthorizedException('Invalid email or password');
      }
      throw error;
    }
  }
}
