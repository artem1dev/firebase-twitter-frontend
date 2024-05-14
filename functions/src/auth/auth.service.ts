import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Auth } from 'firebase-admin/auth';
import { User } from 'firebase/auth';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    private firebaseAuth: Auth;

    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }
    public getTokenForUser(user: User): string {
        return this.jwtService.sign({
            email: user.email,
            sub: user.uid,
        });
    }

    async createUser(createAuthDto: RegisterDto) {
        const { user } = await this.firebaseService.createUserWithEmailAndPassword(
            createAuthDto,
        );
        const userProfile = {
            userId: user.uid,
            email: createAuthDto.email,
            name: createAuthDto.name,
            lastname: createAuthDto.lastName,
        };
        await this.userService.createUser(userProfile);
        return {
            userId: user.uid,
            token: this.getTokenForUser(user),
        };
    }

    async signIn(createAuthDto: LoginDto) {
        return await this.firebaseService.createUserWithEmailAndPassword(
            createAuthDto,
        );
    }
}
