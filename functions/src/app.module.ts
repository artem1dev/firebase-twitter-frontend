import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { CommentModule } from "./comment/comment.module";
import { PostModule } from "./post/post.module";

@Module({
    imports: [UserModule, AuthModule, CommentModule, PostModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
