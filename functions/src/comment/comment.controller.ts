import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiInternalServerErrorResponse, ApiTags } from "@nestjs/swagger";
import { CommentService } from "./comment.service";
import { CreateComment } from "./interfaces/create-comment.interface";
import { UpdateComment } from "./interfaces/update-comment.interface";

@Controller("comment")
@ApiTags("Comment")
@ApiInternalServerErrorResponse({ description: "Oh, something went wrong" })
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllComments() {
        return await this.commentService.getAllComments();
    }

    @Get(":commentId")
    @HttpCode(HttpStatus.OK)
    async getCommentById(@Param("commentId") commentId: string) {
        return await this.commentService.getCommentById(commentId);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createComment(@Body() createCommentDto: CreateComment) {
        return await this.commentService.createComment(createCommentDto);
    }

    @Put(":commentId")
    @HttpCode(HttpStatus.OK)
    async updateComment(@Param("commentId") commentId: string, @Body() updateCommentDto: UpdateComment) {
        return await this.commentService.updateComment(commentId, updateCommentDto);
    }

    @Delete(":commentId")
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteComment(@Param("commentId") commentId: string) {
        return await this.commentService.deleteComment(commentId);
    }
}
