import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import * as express from "express";
import * as functions from "firebase-functions";

const server = express();

export const createNestServer = async (expressInstance) => {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance));
    app.enableCors({
        origin: ['https://fir-twitter-38195.web.app', "http://localhost:3000"],
        methods: '*',
        credentials: true,
    })
    return app.init();
};

createNestServer(server)
    .then((v) => console.log("Nest Ready"))
    .catch((err) => console.error("Nest broken", err));

export const api = functions.https.onRequest(server);