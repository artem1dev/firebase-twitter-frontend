import { Module } from "@nestjs/common";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { PostRepository } from "./post.repository";
import { FirebaseModule } from "src/firebase/firebase.module";

@Module({
    imports: [FirebaseModule],
    controllers: [PostController],
    providers: [PostService, PostRepository],
})
export class PostModule {}
