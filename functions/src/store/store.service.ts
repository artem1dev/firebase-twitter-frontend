import { Injectable } from "@nestjs/common";
import { FirebaseService } from "src/firebase/firebase.service";
import { v4 as uuidv4 } from "uuid";
import * as admin from "firebase-admin";

@Injectable()
export class StoreService {
    constructor(private readonly firebaseService: FirebaseService) {}

    async uploadFile(fileBuffer: Buffer, mimeType: string): Promise<string> {
        const storageBucket = this.firebaseService.getStorage().bucket();
        const fileName = `avatars/${uuidv4()}`; // Generates a unique file name
        const file = storageBucket.file(fileName);
        const stream = file.createWriteStream({
            metadata: {
                contentType: mimeType,
            },
        });

        return new Promise((resolve, reject) => {
            stream.on("error", (error) => reject(error));
            stream.on("finish", async () => {
                await file.makePublic(); // Makes the file publicly accessible
                resolve(`https://storage.googleapis.com/${storageBucket.name}/${fileName}`);
            });
            stream.end(fileBuffer);
        });
    }
}
