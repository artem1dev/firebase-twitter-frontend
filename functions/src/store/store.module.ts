import { Module } from "@nestjs/common";
import { StoreController } from "./store.controller";
import { StoreService } from "./store.service";
import { FirebaseModule } from "src/firebase/firebase.module";
import { FirebaseService } from "src/firebase/firebase.service";

@Module({
    imports: [FirebaseModule],
    controllers: [StoreController],
    providers: [StoreService, FirebaseService],
})
export class StoreModule {}
