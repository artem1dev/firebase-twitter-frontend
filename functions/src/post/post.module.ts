import { Module } from "@nestjs/common";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { PostRepository } from "./post.repository";
import { FirebaseModule } from "src/firebase/firebase.module";
import { UserRepository } from "src/user/user.repository";
import { CommentRepository } from "../comment/comment.repository";

@Module({
    imports: [FirebaseModule],
    controllers: [PostController],
    providers: [PostService, PostRepository, UserRepository, CommentRepository],
})
export class PostModule {}
