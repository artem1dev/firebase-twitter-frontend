import { Injectable } from "@nestjs/common";
import { Firestore } from "firebase-admin/firestore";
import { FirebaseService } from "src/firebase/firebase.service";

@Injectable()
export class CommentRepository {
    firestore: Firestore;
    commentStore: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>;

    constructor(private readonly firebaseService: FirebaseService) {
        this.firestore = firebaseService.getFirestore();
        this.commentStore = this.firestore.collection("comments");
    }

    async getMany() {

    }

    async getOne(commentId: string) {

    }
    
    async create(comment: any) {
        return await this.commentStore.doc(comment.commentId).set(comment);
    }
}