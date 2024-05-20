import { Injectable } from "@nestjs/common";
import { Firestore } from "firebase-admin/firestore";
import { FirebaseService } from "src/firebase/firebase.service";
import { CreatePost } from "./interfaces/create-post.interface";
import { UpdatePost } from "./interfaces/update-post.interface";
import { CreatePostLike } from "./interfaces/create-post-like.interface";

@Injectable()
export class PostRepository {
    firestore: Firestore;
    postStore: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>;

    constructor(private readonly firebaseService: FirebaseService) {
        this.firestore = firebaseService.getFirestore();
        this.postStore = this.firestore.collection("posts");
    }

    async getAll(): Promise<FirebaseFirestore.DocumentData[]> {
        const snapshot = await this.postStore.get();
        return snapshot.empty
            ? []
            : snapshot.docs.map((doc) => ({
                  id: doc.id, // Include the document ID
                  ...doc.data(), // Include all the document data
              }));
    }

    async getOne(postId: string): Promise<FirebaseFirestore.DocumentData | undefined> {
        const doc = await this.postStore.doc(postId).get();
        return doc.exists
            ? {
                  id: doc.id, // Include the document ID
                  ...doc.data(), // Include all the document data
              }
            : undefined;
    }

    async getPostByUserId(userId: string): Promise<FirebaseFirestore.DocumentData[]> {
        const snapshot = await this.postStore.where("userId", "==", userId).get();
        return snapshot.empty
            ? []
            : snapshot.docs.map((doc) => ({
                  id: doc.id, // Include the document ID
                  ...doc.data(), // Include all the document data
              }));
    }

    async getLikesOne(postId: string): Promise<FirebaseFirestore.DocumentData | undefined> {
        const snapshot = await this.postStore.doc(postId).collection("likes").get();
        return snapshot.empty ? [] : snapshot.docs.map((doc) => doc.data());
    }

    async create(post: CreatePost) {
        const newPost = {
            ...post,
            createdAt: new Date(),
        };
        return await this.postStore.add(newPost);
    }

    async createPostLike(data: CreatePostLike) {
        const postRef = await this.postStore.doc(data.postId);
        const postSnapshot = await postRef.get();

        if (!postSnapshot.exists) {
            return "Post not found";
        }
        const post = postSnapshot.data();
        if (post.userId === data.userId) {
            return "You cannot like your own post!";
        }
        const likesRef = await postRef.collection("likes");
        const likeSnapshot = await likesRef.where("userId", "==", data.userId).get();
        if (!likeSnapshot.empty) {
            const likeDoc = likeSnapshot.docs[0];
            const likeData = likeDoc.data();
            if (likeData.like === data.like) {
                await likeDoc.ref.delete();
                return "Like on post deleted successfully";
            } else {
                await likeDoc.ref.update({ like: data.like });
                return "Like on post updated";
            }
        } else {
            await likesRef.add({
                userId: data.userId,
                like: data.like,
            });
            return "Like on post created";
        }
    }

    async update(postId: string, post: UpdatePost): Promise<void> {
        const updatePayload: { [key: string]: any } = {};
        if (post.content) {
            updatePayload["content"] = post.content;
        }
        if (post.title) {
            updatePayload["title"] = post.title;
        }
        await this.postStore.doc(postId).update(updatePayload);
    }

    async delete(postId: string): Promise<void> {
        await this.postStore.doc(postId).delete();
    }
}
