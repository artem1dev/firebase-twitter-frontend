import { Injectable } from "@nestjs/common";
import { Firestore } from "firebase-admin/firestore";
import { FirebaseService } from "src/firebase/firebase.service";
import { CreatePost } from "./interfaces/create-post.interface";
import { UpdatePost } from "./interfaces/update-post.interface";

@Injectable()
export class PostRepository {
    firestore: Firestore;
    postStore: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>;

    constructor(private readonly firebaseService: FirebaseService) {
        this.firestore = firebaseService.getFirestore();
        this.postStore = this.firestore.collection("posts");
    }

    async getOne(postId: string): Promise<FirebaseFirestore.DocumentData | undefined> {
        const doc = await this.postStore.doc(postId).get();
        return doc.exists ? doc.data() : undefined;
    }

    async getAll(): Promise<FirebaseFirestore.DocumentData[]> {
        const snapshot = await this.postStore.get();
        return snapshot.empty ? [] : snapshot.docs.map((doc) => doc.data());
    }

    async create(post: CreatePost): Promise<void> {
        await this.postStore.doc(post.postId).set(post);
    }

    async update(postId: string, post: UpdatePost): Promise<void> {
        await this.postStore.doc(postId).update(post);
    }

    async delete(postId: string): Promise<void> {
        await this.postStore.doc(postId).delete();
    }
}
