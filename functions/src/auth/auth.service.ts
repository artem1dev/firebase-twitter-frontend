import { Injectable } from "@nestjs/common";
import { Auth } from "firebase-admin/auth";
import { FirebaseService } from "src/firebase/firebase.service";
import { RegisterDto } from "./dto/register.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
    private firebaseAuth: Auth;
    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly userService: UserService,
    ) {}
    async createUser(createAuthDto: RegisterDto) {
        const { user } = await this.firebaseService.createUserWithEmailAndPassword(createAuthDto);
        const userProfile = {
            uid: user.uid,
            email: createAuthDto.email,
            name: createAuthDto.name,
            lastname: createAuthDto.lastname,
        };
        this.userService.create(userProfile);
        return { isAuth: true, user: { user, userProfile } };
    }

    async signIn(createAuthDto: RegisterDto) {
        return await this.firebaseService.createUserWithEmailAndPassword(createAuthDto);
    }
}
