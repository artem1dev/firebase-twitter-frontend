import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
    private readonly logger = new Logger(LocalStrategy.name);

    constructor(private readonly authService: AuthService) {
        super();
    }

    public async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.signIn({
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
