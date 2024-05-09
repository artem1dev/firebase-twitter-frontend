import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { CommentModule } from "./comment/comment.module";
import { PostModule } from "./post/post.module";
import { FirebaseService } from "./firebase/firebase.service";
import { FirebaseModule } from "./firebase/firebase.module";

@Module({
    imports: [UserModule, AuthModule, CommentModule, PostModule, FirebaseModule],
    controllers: [AppController],
    providers: [AppService, FirebaseService],
})
export class AppModule {}
