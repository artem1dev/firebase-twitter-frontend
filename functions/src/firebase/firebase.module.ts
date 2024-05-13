import { FirebaseService } from "./firebase.service";
import { Module, DynamicModule } from "@nestjs/common";

@Module({
    providers: [FirebaseService],
    exports: [FirebaseService],
})
export class FirebaseModule {}
