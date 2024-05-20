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
        const commentRef = await this.commentStore.doc(data.commentId);
        const commentSnapshot = await commentRef.get();

        if (!commentSnapshot.exists) {
            return "Comment not found";
        }
        const comment = commentSnapshot.data();
        if (comment.userId === data.userId) {
            return "You cannot like your own comment!";
        }
        const likesRef = await commentRef.collection("likes");
        const likeSnapshot = await likesRef.where("userId", "==", data.userId).get();
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
                like: data.like,
            });
            return "Like on comment created";
        }
    }

    async update(commentId: string, comment: UpdateComment): Promise<void> {
        const updatePayload: { [key: string]: any } = {};
        if (comment.content) {
            updatePayload["content"] = comment.content;
        }
        await this.commentStore.doc(commentId).update(updatePayload);
    }

    async delete(commentId: string): Promise<void> {
        const idsToDelete = [];
        const fetchComments = async (parentId) => {
            const snapshot = await this.commentStore.where("parentId", "==", parentId).get();
            if (!snapshot.empty) {
                for (const doc of snapshot.docs) {
                    idsToDelete.push(doc.id);
                    await fetchComments(doc.id); // Recursively fetch replies
                }
            }
        };
        await fetchComments(commentId);
        const batch = this.firestore.batch();
        idsToDelete.forEach((id) => {
            const ref = this.commentStore.doc(id);
            batch.delete(ref);
        });
        await batch.commit();
        await this.commentStore.doc(commentId).delete();
    }

    async deleteByPostId(postId: string): Promise<void> {
        const snapshot = await this.commentStore.where("postId", "==", postId).get();
        if (snapshot.empty) {
            return;
        }
        const batch = this.firestore.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    }
}
