import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from "src/user/user.service";
import { FirebaseService } from "src/firebase/firebase.service";
import { UserRepository } from "src/user/user.repository";
import { JwtModule } from "@nestjs/jwt";
import authJwtConfig from "../config/jwt.config";
import { AuthJwtGuard } from "./guards/jwt-auth.guard";
import { AuthLocalGuard } from "./guards/local-auth.guard";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: authJwtConfig,
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        UserService,
        FirebaseService,
        UserRepository,
        AuthJwtGuard,
        AuthLocalGuard,
        LocalStrategy,
        JwtStrategy,
    ],
})
export class AuthModule {}
