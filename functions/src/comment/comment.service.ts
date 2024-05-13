import { Injectable } from "@nestjs/common";
import { CommentRepository } from "./comment.repository";
import { CreateComment } from "./interfaces/create-comment.interface";
import { UpdateComment } from "./interfaces/update-comment.interface";

@Injectable()
export class CommentService {
    constructor(private readonly commentRepository: CommentRepository) {}

    async getAllComments() {
        return await this.commentRepository.getAll();
    }

    async getCommentById(commentId: string) {
        const comment = await this.commentRepository.getOne(commentId);
        if (!comment) {
            throw new Error("Comment not found");
        }
        return comment;
    }

    async createComment(comment: CreateComment) {
        await this.commentRepository.create(comment);
        return { isAuth: true, comment: comment };
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
