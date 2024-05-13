import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { FirebaseModule } from "src/firebase/firebase.module";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { UserRepository } from "src/user/user.repository";

@Module({
    imports: [FirebaseModule, UserModule],
    controllers: [AuthController],
    providers: [AuthService, UserService, UserRepository],
})
export class AuthModule {}
