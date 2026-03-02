import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { InterestModule } from './modules/interest/interest.module';
import { ProjectModule } from './modules/project/project.module';

@Module({
  imports: [UserModule, InterestModule, ProjectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
