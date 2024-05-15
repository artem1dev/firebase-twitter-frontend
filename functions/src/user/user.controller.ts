import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiInternalServerErrorResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { CreateUser } from "./interfaces/create-user.interface";
import { UpdateUser } from "./interfaces/update-user.interface";

@Controller("user")
@ApiTags("User")
@ApiInternalServerErrorResponse({ description: "Oh, something went wrong" })
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllUsers() {
        return await this.userService.getAllUsers();
    }

    @Get(":userId")
    @HttpCode(HttpStatus.OK)
    async getUserById(@Param("userId") userId: string) {
        return await this.userService.getUserById(userId);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() createUserDto: CreateUser) {
        return await this.userService.createUser(createUserDto);
    }

    @Put(":userId")
    @HttpCode(HttpStatus.OK)
    async updateUser(@Param("userId") userId: string, @Body() updateUserDto: UpdateUser) {
        return await this.userService.updateUser(userId, updateUserDto);
    }

    @Delete(":userId")
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Param("userId") userId: string) {
        return await this.userService.deleteUser(userId);
    }
}
