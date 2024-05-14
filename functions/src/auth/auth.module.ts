import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserRepository } from 'src/user/user.repository';
import { JwtModule } from '@nestjs/jwt';
import authJwtConfig from '../config/jwt.config';

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: authJwtConfig,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService, FirebaseService, UserRepository],
})
export class AuthModule { }
