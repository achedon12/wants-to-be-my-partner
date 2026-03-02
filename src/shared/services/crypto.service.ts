import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../../modules/user/enum/role';

@Injectable()
export class CryptoService {
  constructor(private jwtService: JwtService) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async passwordVerify(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(role: string = Role.Entrepreneur): string {
    const roles = Object.values(Role);

    if (!roles.includes(role as Role)) {
      throw new Error(`Invalid role: ${role}`);
    }

    const payload = { role };
    return this.jwtService.sign(payload);
  }
}

