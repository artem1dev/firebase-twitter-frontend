import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePost } from "./interfaces/create-post.interface";
import { UpdatePost } from "./interfaces/update-post.interface";

@Controller("post")
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get()
    async getAllPosts() {
        return await this.postService.getAllPosts();
    }

    @Get(":postId")
    async getPostById(@Param("postId") postId: string) {
        return await this.postService.getPostById(postId);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPost(@Body() createPostDto: CreatePost) {
        return await this.postService.createPost(createPostDto);
    }

    @Put(":postId")
    async updatePost(@Param("postId") postId: string, @Body() updatePostDto: UpdatePost) {
        return await this.postService.updatePost(postId, updatePostDto);
    }

    @Delete(":postId")
    async deletePost(@Param("postId") postId: string) {
        return await this.postService.deletePost(postId);
    }
}
