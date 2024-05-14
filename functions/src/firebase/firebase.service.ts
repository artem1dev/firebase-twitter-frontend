/* eslint-disable @typescript-eslint/no-var-requires */
import { Inject, Injectable } from "@nestjs/common";
import { FirebaseOptions } from "firebase/app";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from "firebase/auth";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { getFirestore } from "firebase-admin/firestore";
@Injectable()
export class FirebaseService {
    private readonly app;

    constructor() {
        if (!admin.apps.length) {
            this.app = admin.initializeApp({
                credential: admin.credential.cert(process.env.SERVICE_ACCOUNT_PATH),
                databaseURL: `https://${process.env.PROJECT_ID}.firebaseio.com`,
            });
        } else {
            this.app = admin.apps[0];
        }
    }

    getApp() {
        return this.app;
    }

    getAuth() {
        return admin.auth(this.app);
    }

    getFirestore() {
        return getFirestore();
    }

    async createUserWithEmailAndPassword({ email, password }: { email: string; password: string }) {
        const userRecord = await this.getAuth().createUser({
            email,
            password
        });
        return userRecord;
    }

    async signInWithEmailAndPassword({ email, password }: { email: string; password: string }) {
        return await signInWithEmailAndPassword(getAuth(), email, password);
    }
}
