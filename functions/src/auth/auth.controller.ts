import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ApiInternalServerErrorResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "./decorators/current-user.decorator";

@Controller("auth")
@ApiTags("Auth")
@ApiInternalServerErrorResponse({ description: "Oh, something went wrong" })
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/register")
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerDto: RegisterDto) {
        return await this.authService.createUser(registerDto);
    }

    @Post("/login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto, @CurrentUser() user) {
        return await this.authService.signIn(loginDto);
    }
}
