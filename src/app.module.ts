import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from './modules/user/user.module';
import {InterestModule} from './modules/interest/interest.module';
import {ProjectModule} from './modules/project/project.module';
import {InvestmentModule} from './modules/investment/investment.module';
import {AuthModule} from "./auth/auth.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmConfig} from "./config/typeorm";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(typeOrmConfig(new ConfigService())),
        UserModule,
        InterestModule,
        ProjectModule,
        InvestmentModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
