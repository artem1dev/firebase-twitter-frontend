import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ApiInternalServerErrorResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResponseAuthDto } from "./dto/response.dto";
import { CurrentUser } from "./decorators/current-user.decorator";

@Controller("auth")
@ApiTags("Auth")
@ApiInternalServerErrorResponse({ description: "Oh, something went wrong" })
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/register")
    @HttpCode(201)
    @ApiResponse({
        status: 200,
        description: "Registered",
        type: ResponseAuthDto,
    })
    register(@Body() registerDto: RegisterDto) {
        return this.authService.createUser(registerDto);
    }

    @Post("/login")
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: "Authorized",
    })
    login(@Body() loginDto: LoginDto, @CurrentUser() user) {
        return {
            userId: user.id,
            token: this.authService.getTokenForUser(user.email, user.id),
        };
    }
}
