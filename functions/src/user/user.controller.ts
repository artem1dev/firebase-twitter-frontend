import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUser } from "./interfaces/create-user.interface";
import { UpdateUser } from "./interfaces/update-user.interface";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getAllUsers() {
        return await this.userService.getAllUsers();
    }

    @Get(":userId")
    async getUserById(@Param("userId") userId: string) {
        return await this.userService.getUserById(userId);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() createUserDto: CreateUser) {
        return await this.userService.createUser(createUserDto);
    }

    @Put(":userId")
    async updateUser(@Param("userId") userId: string, @Body() updateUserDto: UpdateUser) {
        return await this.userService.updateUser(userId, updateUserDto);
    }

    @Delete(":userId")
    async deleteUser(@Param("userId") userId: string) {
        return await this.userService.deleteUser(userId);
    }
}
