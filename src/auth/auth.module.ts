import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {JwtStrategy} from './jwt.strategy';
import {UserModule} from "../modules/user/user.module";
import {SharedModule} from "../shared/shared.module";

@Module({
    imports: [
        UserModule,
        SharedModule,
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {
}
