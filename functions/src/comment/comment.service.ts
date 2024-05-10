import { Injectable } from "@nestjs/common";
import { CommentRepository } from "./comment.repository";

@Injectable()
export class CommentService {
    constructor(private readonly commentService: CommentService) {}

    async create(comment: any) {

    }
}
