import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiInternalServerErrorResponse, ApiTags } from "@nestjs/swagger";
import { PostService } from "./post.service";
import { CreatePost } from "./interfaces/create-post.interface";
import { UpdatePost } from "./interfaces/update-post.interface";

@Controller("post")
@ApiTags("Post")
@ApiInternalServerErrorResponse({ description: "Oh, something went wrong" })
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllPosts() {
        return await this.postService.getAllPosts();
    }

    @Get(":postId")
    @HttpCode(HttpStatus.OK)
    async getPostById(@Param("postId") postId: string) {
        return await this.postService.getPostById(postId);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPost(@Body() createPostDto: CreatePost) {
        return await this.postService.createPost(createPostDto);
    }

    @Put(":postId")
    @HttpCode(HttpStatus.OK)
    async updatePost(@Param("postId") postId: string, @Body() updatePostDto: UpdatePost) {
        return await this.postService.updatePost(postId, updatePostDto);
    }

    @Delete(":postId")
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePost(@Param("postId") postId: string) {
        return await this.postService.deletePost(postId);
    }
}
