import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { FirebaseModule } from "src/firebase/firebase.module";
import { StoreService } from "src/store/store.service";
import { FirebaseService } from "src/firebase/firebase.service";

@Module({
    imports: [FirebaseModule],
    controllers: [UserController],
    providers: [UserService, UserRepository, StoreService, FirebaseService],
})
export class UserModule {}
