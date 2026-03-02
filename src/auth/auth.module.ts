import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {JwtStrategy} from './jwt.strategy';
import {RolesGuard} from './roles.guard';
import {UserModule} from "../modules/user/user.module";
import {SharedModule} from "../shared/shared.module";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule,
        UserModule,
        SharedModule,
    ],
    providers: [AuthService, JwtStrategy, RolesGuard],
    controllers: [AuthController],
    exports: [AuthService, RolesGuard],
})
export class AuthModule {
}
