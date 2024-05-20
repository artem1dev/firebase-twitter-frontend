import { Injectable } from "@nestjs/common";
import { Firestore } from "firebase-admin/firestore";
import { FirebaseService } from "src/firebase/firebase.service";
import { CreateComment } from "./interfaces/create-comment.interface";
import { UpdateComment } from "./interfaces/update-comment.interface";
import { CreatePostLike } from "src/post/interfaces/create-post-like.interface";
import { CreateCommentLike } from "./interfaces/create-comment-like.interface";

@Injectable()
export class CommentRepository {
    firestore: Firestore;
    commentStore: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>;

    constructor(private readonly firebaseService: FirebaseService) {
        this.firestore = firebaseService.getFirestore();
        this.commentStore = this.firestore.collection("comments");
    }

    async getAll(): Promise<FirebaseFirestore.DocumentData[]> {
        const snapshot = await this.commentStore.get();
        return snapshot.empty
            ? []
            : snapshot.docs.map((doc) => ({
                  id: doc.id, // Include the document ID
                  ...doc.data(), // Include all the document data
              }));
    }

    async getOne(commentId: string): Promise<FirebaseFirestore.DocumentData | undefined> {
        const doc = await this.commentStore.doc(commentId).get();
        return doc.exists
            ? {
                  id: doc.id, // Include the document ID
                  ...doc.data(), // Include all the document data
              }
            : undefined;
    }

    async getAllByPostId(postId: string): Promise<FirebaseFirestore.DocumentData[]> {
        const snapshot = await this.commentStore.where("postId", "==", postId).get();
        return snapshot.empty
            ? []
            : snapshot.docs.map((doc) => ({
                  id: doc.id, // Include the document ID
                  ...doc.data(), // Include all the document data
              }));
    }

    async getLikesOne(commentId: string): Promise<FirebaseFirestore.DocumentData | undefined> {
        const snapshot = await this.commentStore.doc(commentId).collection("likes").get();
        return snapshot.empty ? [] : snapshot.docs.map((doc) => doc.data());
    }

    async create(comment: CreateComment) {
        const newComment = {
            ...comment,
            createdAt: new Date(),
        };
        return await this.commentStore.add(newComment);
    }

    async createCommentLike(data: CreateCommentLike) {
        const commentRef  = await this.commentStore.doc(data.commentId);
        const commentSnapshot = await commentRef.get();
        
        if (!commentSnapshot.exists) {
            return "Comment not found";
        }
        const comment = commentSnapshot.data();
        if (comment.userId === data.userId) {
            return "You cannot like your own comment!";
        }
        const likesRef = await commentRef.collection("likes");
        const likeSnapshot = await likesRef.where('userId', '==', data.userId).get();
        if (!likeSnapshot.empty) {
            const likeDoc = likeSnapshot.docs[0];
            const likeData = likeDoc.data();
            if (likeData.like === data.like) {
                await likeDoc.ref.delete();
                return "Like on comment deleted successfully";
            } else {
                await likeDoc.ref.update({ like: data.like });
                return "Like on comment updated";
            }
        } else {
            await likesRef.add({
                userId: data.userId,
                like: data.like
            });
            return "Like on comment created";
        }
    }

    async update(commentId: string, comment: UpdateComment): Promise<void> {
        await this.commentStore.doc(commentId).update(comment);
    }

    async delete(commentId: string): Promise<void> {
        await this.commentStore.doc(commentId).delete();
    }
}
