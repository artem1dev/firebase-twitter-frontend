import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
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

    async getAll(): Promise<FirebaseFirestore.DocumentData[]> {
        const snapshot = await this.userStore.get();
        return snapshot.empty
            ? []
            : snapshot.docs.map((doc) => ({
                  id: doc.id, // Include the document ID
                  ...doc.data(), // Include all the document data
              }));
    }

    async getOneByID(userId: string): Promise<FirebaseFirestore.DocumentData | undefined> {
        try {
            if (!userId || typeof userId !== "string" || userId.trim() === "") {
                throw new BadRequestException("Invalid or empty userId provided");
            }
            const doc = await this.userStore.doc(userId).get();
            return doc.exists
                ? {
                      id: doc.id, // Include the document ID
                      ...doc.data(), // Include all the document data
                  }
                : undefined;
        } catch (error) {
            return error;
        }
    }

    async create(user: CreateUser): Promise<void> {
        await this.userStore.doc(user.userId).set({
            ...user,
            profilePic: "default.png",
        });
    }

    async update(userId: string, user: UpdateUser): Promise<void> {
        const userRef = this.userStore.doc(userId);

        // Build update payload dynamically
        const updatePayload: { [key: string]: any } = {};
        Object.keys(user).forEach((key) => {
            if (user[key] !== undefined) {
                updatePayload[key] = user[key];
            }
        });

        try {
            await userRef.update(updatePayload);
        } catch (error) {
            if (error.code === "not-found") {
                throw new NotFoundException("User not found");
            }
            throw error;
        }
    }

    async delete(userId: string): Promise<void> {
        const userRef = await this.userStore.doc(userId);
        const userSnapshot = await userRef.get();
        if (!userSnapshot.exists) {
            throw new NotFoundException("User not found");
        }
        await this.userStore.doc(userId).delete();
    }
}
