import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Interest } from '../interest/entities/interest.entity';
import { SharedModule } from '../../shared/shared.module';
import { InterestModule } from '../interest/interest.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Interest]), SharedModule, InterestModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
