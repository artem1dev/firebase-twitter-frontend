import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { FirebaseService } from "src/firebase/firebase.service";
import { UserRepository } from "src/user/user.repository";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
    private readonly logger = new Logger(LocalStrategy.name);
    
    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly userRepository: UserRepository,
    ) {
        super();
    }

    public async validate(email: string, password: string): Promise<any> {
        const { user } = await this.firebaseService.signInWithEmailAndPassword({
            email,
            password,
        });
        if (!user) {
            this.logger.debug(`Invalid credentials for user`);
            throw new UnauthorizedException();
        }
        return user;
    }
}
