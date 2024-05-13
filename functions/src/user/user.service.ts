import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CreateUser } from "./interfaces/create-user.interface";
import { UpdateUser } from "./interfaces/update-user.interface";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async createUser(user: CreateUser) {
        await this.userRepository.create(user);
        return { isAuth: true, user: user };
    }

    async getUserById(userId: string) {
        const user = await this.userRepository.getOne(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async getAllUsers() {
        return await this.userRepository.getAll();
    }

    async updateUser(userId: string, user: UpdateUser) {
        await this.userRepository.update(userId, user);
        return { updated: true };
    }

    async deleteUser(userId: string) {
        await this.userRepository.delete(userId);
        return { deleted: true };
    }
}
