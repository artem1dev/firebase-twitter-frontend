import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FirebaseModule } from "./firebase/firebase.module";
import firebaseConfig from "./config/firebase.config";
import { FirebaseService } from "./firebase/firebase.service";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { CommentModule } from "./comment/comment.module";
import { PostModule } from "./post/post.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [firebaseConfig],
            expandVariables: true,
        }),
        FirebaseModule.forRoot(firebaseConfig()),
        UserModule,
        AuthModule,
        CommentModule,
        PostModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
