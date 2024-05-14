import { Injectable } from "@nestjs/common";
import { Firestore } from "firebase-admin/firestore";
import { FirebaseService } from "src/firebase/firebase.service";
import { CreateComment } from "./interfaces/create-comment.interface";
import { UpdateComment } from "./interfaces/update-comment.interface";

@Injectable()
export class CommentRepository {
    firestore: Firestore;
    commentStore: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>;

    constructor(private readonly firebaseService: FirebaseService) {
        this.firestore = firebaseService.getFirestore();
        this.commentStore = this.firestore.collection("comments");
    }

    async getOne(commentId: string): Promise<FirebaseFirestore.DocumentData | undefined> {
        const doc = await this.commentStore.doc(commentId).get();
        return doc.exists ? doc.data() : undefined;
    }

    async getAll(): Promise<FirebaseFirestore.DocumentData[]> {
        const snapshot = await this.commentStore.get();
        return snapshot.empty ? [] : snapshot.docs.map((doc) => doc.data());
    }

    async create(comment: CreateComment) {
        return await this.commentStore.add(comment);
    }

    async update(commentId: string, comment: UpdateComment): Promise<void> {
        await this.commentStore.doc(commentId).update(comment);
    }

    async delete(commentId: string): Promise<void> {
        await this.commentStore.doc(commentId).delete();
    }
}
