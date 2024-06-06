import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NextFunction, Request, Response } from "express";
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV !== 'test' ? '.env' : '.env.test' });
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        allowedHeaders: "*",
        methods: '*',
        origin: ['https://fir-twitter-38195.web.app', "http://localhost:3000"], // Or dynamically set or use true for reflecting request origin
        credentials: true, // If your front-end needs to send credentials like cookies or auth headers
    });
    app.use(function (request: Request, response: Response, next: NextFunction) {
        response.setHeader('Access-Control-Allow-Origin', 'https://fir-twitter-38195.web.app');
        response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        next();
    });
    await app.listen(8080);
}
bootstrap();
