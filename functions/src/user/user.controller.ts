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
    UploadedFile,
    UseInterceptors,
    ForbiddenException,
    BadRequestException,
    Req,
} from "@nestjs/common";
import { ApiConsumes, ApiInternalServerErrorResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { CreateUser } from "./interfaces/create-user.interface";
import { UpdateUser } from "./interfaces/update-user.interface";
import { AuthJwtGuard } from "src/auth/guards/jwt-auth.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { FileInterceptor } from "@nestjs/platform-express";

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

    @Post("/avatar")
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthJwtGuard)
    async addProfilePicture(@Req() req, @CurrentUser() user) {
        const file: Express.Multer.File = req.files?.find((file: Express.Multer.File) => file.fieldname === "image");
        console.log(req.files);
        if (!file) {
            throw new BadRequestException("File is not provided");
        }
        await this.userService.addProfilePicture(file.buffer, file.mimetype, user.userId);
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
