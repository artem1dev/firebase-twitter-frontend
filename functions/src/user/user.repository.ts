import { Injectable } from "@nestjs/common";
import { Firestore } from "firebase-admin/firestore";
import { FirebaseService } from "src/firebase/firebase.service";
import { CreateUser } from "./interfaces/create-user.interface";
import { UpdateUser } from "./interfaces/update-user.interface";

@Injectable()
export class UserRepository {
    firestore: Firestore;
    userStore: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>;

    constructor(private readonly firebaseService: FirebaseService) {
        this.firestore = firebaseService.getFirestore();
        this.userStore = this.firestore.collection("users");
    }

    async getOne(userId: string) {
        const doc = await this.userStore.doc(userId).get();
        if (!doc.exists) {
            console.log("No such document!");
        } else {
            return doc.data();
        }
    }

    async getMany() {
        const snapshot = await this.userStore.get();
        if (snapshot.empty) {
            return [];
        }
        const result = [];
        snapshot.forEach((doc) => {
            result.push(doc.data());
        });
        return result;
    }

    async create(user: CreateUser) {
        return await this.userStore.doc(user.userId).set(user);
    }
    // async update(uid: string, user: UpdateUser) {
    //     return await this.userStore.doc(uid).update(user);
    // }
}
