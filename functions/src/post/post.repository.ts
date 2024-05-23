import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
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

    async getAll({
        page,
        limit,
    }): Promise<{ data: FirebaseFirestore.DocumentData[]; totalPages: number; currentPage: number }> {
        const allDocsSnapshot = await this.postStore.orderBy("createdAt", "desc").get();
        const totalDocuments = allDocsSnapshot.size;
        const totalPages = Math.ceil(totalDocuments / limit);
        const offset = (page - 1) * limit;
        // Use the documents already fetched to slice out the page data
        const data = allDocsSnapshot.docs.slice(offset, offset + limit).map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return {
            data,
            totalPages,
            currentPage: page,
        };
    }

    async findPosts(text: string): Promise<FirebaseFirestore.DocumentData[] | undefined> {
        const snapshot = await this.postStore.get();
        return snapshot.empty
            ? []
            : snapshot.docs
                  .filter((doc) => doc.data().title.toLowerCase().includes(text.toLowerCase()))
                  .map((doc) => ({
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
            throw new NotFoundException("Post not found");
        }
        const post = postSnapshot.data();
        if (post.userId === data.userId) {
            throw new BadRequestException("You cannot like your own post!");
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

    async update(postId: string, post: UpdatePost, userId: string): Promise<void> {
        const postRef = await this.postStore.doc(postId);
        const postSnapshot = await postRef.get();
        if (!postSnapshot.exists) {
            throw new NotFoundException("Post not found");
        }
        const postOne = postSnapshot.data();
        if (postOne.userId !== userId) {
            throw new ForbiddenException("You can update only own posts!");
        }
        const updatePayload: { [key: string]: any } = {};
        if (post.content) {
            updatePayload["content"] = post.content;
        }
        if (post.title) {
            updatePayload["title"] = post.title;
        }
        await this.postStore.doc(postId).update(updatePayload);
    }

    async delete(postId: string, userId: string): Promise<void> {
        const postRef = await this.postStore.doc(postId);
        const postSnapshot = await postRef.get();
        if (!postSnapshot.exists) {
            throw new NotFoundException("Post not found");
        }
        const postOne = postSnapshot.data();
        if (postOne.userId !== userId) {
            throw new ForbiddenException("You can delete only own posts!");
        }
        await this.postStore.doc(postId).delete();
    }
}
