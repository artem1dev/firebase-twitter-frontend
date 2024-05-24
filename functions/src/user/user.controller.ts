import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    ForbiddenException,
} from "@nestjs/common";
import { ApiInternalServerErrorResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { CreateUser } from "./interfaces/create-user.interface";
import { UpdateUser } from "./interfaces/update-user.interface";
import { AuthJwtGuard } from "src/auth/guards/jwt-auth.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";

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
    @UseGuards(AuthJwtGuard)
    async updateUser(@Param("userId") userId: string, @Body() updateUserDto: UpdateUser, @CurrentUser() user) {
        if (userId !== user.userId) throw new ForbiddenException("You can update only own user!");
        return await this.userService.updateUser(userId, updateUserDto);
    }

    @Delete(":userId")
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AuthJwtGuard)
    async deleteUser(@Param("userId") userId: string, @CurrentUser() user) {
        if (userId !== user.userId) throw new ForbiddenException("You can delete only own user!");
        return await this.userService.deleteUser(userId);
    }
}
