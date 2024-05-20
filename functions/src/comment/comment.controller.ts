import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiInternalServerErrorResponse, ApiTags } from "@nestjs/swagger";
import { CommentService } from "./comment.service";
import { CreateComment } from "./interfaces/create-comment.interface";
import { UpdateComment } from "./interfaces/update-comment.interface";
import { AuthJwtGuard } from "src/auth/guards/jwt-auth.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { CreateCommentLike } from "./interfaces/create-comment-like.interface";

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
    @UseGuards(AuthJwtGuard)
    async createComment(@Body() createCommentDto: CreateComment, @CurrentUser() user) {
        return await this.commentService.createComment({ ...createCommentDto, userId: user.userId });
    }

    @Post(":commentId/like")
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthJwtGuard)
    async createCommentLike(
        @Param("commentId") commentId: string,
        @Body() createCommentLikeDto: CreateCommentLike,
        @CurrentUser() user,
    ) {
        return await this.commentService.createCommentLike({
            ...createCommentLikeDto,
            commentId: commentId,
            userId: user.userId,
        });
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
