import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}
    
    async create(user: any) {
        const userProfile = {
            uid: user.uid,
            email: user.email,
            name: user.name,
            lastname: user.lastname,
            role: 1,
        };
        await this.userRepository.create(userProfile);

        return { isAuth: true, user: userProfile };
    }
}
