import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FirebaseModule } from "./firebase/firebase.module";
import firebaseConfig from "./config/firebase.config";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { CommentModule } from "./comment/comment.module";
import { PostModule } from "./post/post.module";
import { StoreModule } from "./store/store.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [firebaseConfig],
            expandVariables: true,
        }),
        FirebaseModule,
        UserModule,
        AuthModule,
        CommentModule,
        PostModule,
        StoreModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
