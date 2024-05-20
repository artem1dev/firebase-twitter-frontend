import { Injectable } from "@nestjs/common";
import { PostRepository } from "./post.repository";
import { UserRepository } from "../user/user.repository";
import { CommentRepository } from "../comment/comment.repository";
import { CreatePost } from "./interfaces/create-post.interface";
import { UpdatePost } from "./interfaces/update-post.interface";
import { CreatePostLike } from "./interfaces/create-post-like.interface";

@Injectable()
export class PostService {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly userRepository: UserRepository,
        private readonly commentRepository: CommentRepository,
    ) {}

    async getAllPosts() {
        const posts = await this.postRepository.getAll();

        if (posts) {
            for (const post of posts) {
                const user = await this.userRepository.getOneByID(post.userId);
                if (user) {
                    post.authorName = user.name;
                    post.authorLastName = user.lastname;
                }
                post.createdAt = post.createdAt._seconds * 1000 + post.createdAt._nanoseconds / 1000000;
                const postLikes = await this.postRepository.getLikesOne(post.id);
                const counts = {
                    true: 0,
                    false: 0,
                };
                postLikes.forEach((item) => {
                    if (item.like == true) {
                        counts.true += 1;
                    } else {
                        counts.false += 1;
                    }
                });
                post.likeCount = counts.true;
                post.dislikeCount = counts.false;
                const comments = await this.commentRepository.getAllByPostId(post.id);
                post.commentsCount = comments.length;
            }
            return posts;
        }
        return "Posts not found";
    }

    async getPostById(postId: string) {
        const post = await this.postRepository.getOne(postId);
        if (!post) {
            throw new Error("Post not found");
        }
        const user = await this.userRepository.getOneByID(post.userId);
        if (user) {
            post.authorName = user.name;
            post.authorLastName = user.lastname;
        }
        post.createdAt = post.createdAt._seconds * 1000 + post.createdAt._nanoseconds / 1000000;
        const postLikes = await this.postRepository.getLikesOne(post.id);
        const counts = {
            true: 0,
            false: 0,
        };
        postLikes.forEach((item) => {
            if (item.like == true) {
                counts.true += 1;
            } else {
                counts.false += 1;
            }
        });
        post.likeCount = counts.true;
        post.dislikeCount = counts.false;
        const comments = await this.commentRepository.getAllByPostId(post.id);
        for (const comment of comments) {
            const userComment = await this.userRepository.getOneByID(comment.userId);
            const likesComment = await this.commentRepository.getLikesOne(comment.id);
            const commentCounts = {
                true: 0,
                false: 0,
            };
            likesComment.forEach((item) => {
                if (item.like == true) {
                    commentCounts.true += 1;
                } else {
                    commentCounts.false += 1;
                }
            });
            comment.createdAt = comment.createdAt._seconds * 1000 + comment.createdAt._nanoseconds / 1000000;
            comment.name = userComment.name;
            comment.lastname = userComment.lastname;
            comment.likeCounts = commentCounts.true;
            comment.dislikeCounts = commentCounts.false;
        }
        const buildTree = (parentId = null) => {
            try {
                return comments
                    .filter((comment) => (comment.parentId ? comment.parentId : null) === parentId)
                    .map((comment) => ({
                        ...comment,
                        replies: buildTree(comment.id),
                    }));
            } catch (error) {
            }
        };
        post.comments = buildTree(null);
        return post;
    }

    async getPostByUserId(userId: string) {
        const posts = await this.postRepository.getPostByUserId(userId);

        if (posts) {
            for (const post of posts) {
                const user = await this.userRepository.getOneByID(post.userId);
                if (user) {
                    post.authorName = user.name;
                    post.authorLastName = user.lastname;
                }
                post.createdAt = post.createdAt._seconds * 1000 + post.createdAt._nanoseconds / 1000000;
                const postLikes = await this.postRepository.getLikesOne(post.id);
                const counts = {
                    true: 0,
                    false: 0,
                };
                postLikes.forEach((item) => {
                    if (item.like == true) {
                        counts.true += 1;
                    } else {
                        counts.false += 1;
                    }
                });
                post.likeCount = counts.true;
                post.dislikeCount = counts.false;
                const comments = await this.commentRepository.getAllByPostId(post.id);
                post.commentsCount = comments.length;
            }
            return posts;
        }
        return "Posts not found";
    }


    async createPost(post: CreatePost) {
        await this.postRepository.create(post);
        return { post: post };
    }

    async createPostLike(postLike: CreatePostLike) {
        await this.postRepository.createPostLike(postLike);
        return { post: postLike };
    }

    async updatePost(postId: string, post: UpdatePost) {
        await this.postRepository.update(postId, post);
        return { updated: true };
    }

    async deletePost(postId: string) {
        await this.commentRepository.deleteByPostId(postId);
        await this.postRepository.delete(postId);
        return { deleted: true };
    }
}
