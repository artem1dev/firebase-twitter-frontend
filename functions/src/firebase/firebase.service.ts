/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from "@nestjs/common";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import * as admin from "firebase-admin";
import { App } from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseApp } from "firebase/app";

@Injectable()
export class FirebaseService {
    private readonly app;
    private readonly firebase: FirebaseApp;

    constructor() {
        if (!admin.apps.length) {
            this.app = admin.initializeApp({
                credential: admin.credential.cert(process.env.SERVICE_ACCOUNT_PATH),
                databaseURL: `https://${process.env.PROJECT_ID}.firebaseio.com`,
            });
        } else {
            this.app = admin.apps[0];
        }
        this.firebase = firebase.initializeApp({
            apiKey: process.env.API_KEY,
            authDomain: process.env.AUTH_DOMAIN,
            projectId: process.env.PROJECT_ID,
            storageBucket: process.env.STORAGE_BUCKET,
            messagingSenderId: process.env.MESSAGING_SENDER_ID,
            appId: process.env.APP_ID,
            measurementId: process.env.MEASUREMENT_ID,
        });
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
            password,
        });
        return userRecord;
    }

    async signInWithEmailAndPassword({ email, password }: { email: string; password: string }) {
        try {
            return (await firebase.auth().signInWithEmailAndPassword(email, password)).user;
        } catch (error) {
            console.log(error);
        }
    }
}
