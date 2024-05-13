import { Inject, Injectable } from "@nestjs/common";
import { FirebaseOptions } from "firebase/app";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from "firebase/auth";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { getFirestore } from "firebase-admin/firestore";

@Injectable()
export class FirebaseService {
    private readonly app;

    constructor(@Inject("CONFIG_OPTIONS") private firebaseConfig: FirebaseOptions) {
        this.app = admin.initializeApp(functions.config().firebase);
    }

    getApp() {
        return this.app;
    }

    getAuth() {
        return getAuth(this.app);
    }

    getFirestore() {
        return getFirestore();
    }

    async createUserWithEmailAndPassword({ email, password }: { email: string; password: string }) {
        return await createUserWithEmailAndPassword(getAuth(), email, password);
    }

    async signInWithEmailAndPassword({ email, password }: { email: string; password: string }) {
        return await signInWithEmailAndPassword(getAuth(), email, password);
    }
}
