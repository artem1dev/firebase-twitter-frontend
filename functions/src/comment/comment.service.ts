import { Injectable } from "@nestjs/common";
import { CommentRepository } from "./comment.repository";
import { CreateComment } from "./interfaces/create-comment.interface";
import { UpdateComment } from "./interfaces/update-comment.interface";
import { CreateCommentLike } from "./interfaces/create-comment-like.interface";

@Injectable()
export class CommentService {
    constructor(private readonly commentRepository: CommentRepository) {}

    async getAllComments() {
        const comments = await this.commentRepository.getAll();
        if (comments) {
            for (const comment of comments) {
                comment.createdAt = comment.createdAt._seconds * 1000 + comment.createdAt._nanoseconds / 1000000;
            }
        }
        return comments;
    }

    async getCommentById(commentId: string) {
        const comment = await this.commentRepository.getOne(commentId);
        if (!comment) {
            throw new Error("Comment not found");
        }
        if (comment) {
            comment.createdAt = comment.createdAt._seconds * 1000 + comment.createdAt._nanoseconds / 1000000;
        }
        return comment;
    }

    async createComment(comment: CreateComment) {
        await this.commentRepository.create(comment);
        return { isAuth: true, comment: comment };
    }

    async createCommentLike(commentLike: CreateCommentLike) {
        await this.commentRepository.createCommentLike(commentLike);
        return { comment: commentLike };
    }

    async updateComment(commentId: string, comment: UpdateComment) {
        await this.commentRepository.update(commentId, comment);
        return { updated: true };
    }

    async deleteComment(commentId: string) {
        await this.commentRepository.delete(commentId);
        return { deleted: true };
    }
}
