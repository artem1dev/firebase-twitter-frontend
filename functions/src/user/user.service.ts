import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CreateUser } from "./interfaces/create-user.interface";
import { UpdateUser } from "./interfaces/update-user.interface";
import { FirebaseService } from "src/firebase/firebase.service";
import { StoreService } from "src/store/store.service";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly firebaseService: FirebaseService,
        private readonly storage: StoreService,
    ) {}

    async getAllUsers() {
        return await this.userRepository.getAll();
    }

    async getUserById(userId: string) {
        const user = await this.userRepository.getOneByID(userId);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    async createUser(user: CreateUser) {
        await this.userRepository.create(user);
        return { isAuth: true, user: user };
    }

    async addProfilePicture(file: Buffer, mimeType: string, userId: any) {
        console.log(1);
        const filepath = await this.storage.uploadFile(file, mimeType);
        console.log(2);
    }

    async updateUser(userId: string, user: UpdateUser) {
        await this.userRepository.update(userId, user);
        return { updated: true };
    }

    async deleteUser(userId: string) {
        await this.userRepository.delete(userId);
        await this.firebaseService.deleteUser(userId);
        return { deleted: true };
    }
}
