import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { FirebaseModule } from "src/firebase/firebase.module";

@Module({
    imports: [FirebaseModule],
    controllers: [UserController],
    providers: [UserService, UserRepository],
})
export class UserModule {}
