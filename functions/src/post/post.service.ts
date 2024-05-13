import { Injectable } from "@nestjs/common";
import { PostRepository } from "./post.repository";
import { CreatePost } from "./interfaces/create-post.interface";
import { UpdatePost } from "./interfaces/update-post.interface";

@Injectable()
export class PostService {
    constructor(private readonly postRepository: PostRepository) {}

    async getAllPosts() {
        return await this.postRepository.getAll();
    }

    async getPostById(postId: string) {
        const post = await this.postRepository.getOne(postId);
        if (!post) {
            throw new Error("Post not found");
        }
        return post;
    }

    async createPost(post: CreatePost) {
        await this.postRepository.create(post);
        return { isAuth: true, post: post };
    }

    async updatePost(postId: string, post: UpdatePost) {
        await this.postRepository.update(postId, post);
        return { updated: true };
    }

    async deletePost(postId: string) {
        await this.postRepository.delete(postId);
        return { deleted: true };
    }
}
