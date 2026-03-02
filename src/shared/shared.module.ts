import { Module } from '@nestjs/common';
import { CryptoService } from './services/crypto.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'default_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class SharedModule {}

