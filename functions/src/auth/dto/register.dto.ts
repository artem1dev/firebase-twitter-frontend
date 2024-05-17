import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
    @ApiProperty({
        example: "baiden2024@email.com",
        type: String,
    })
    email: string;

    @ApiProperty({
        example: "Volodymyr",
        type: String,
    })
    name: string;

    @ApiProperty({
        example: "Zelensky",
        type: String,
    })
    lastName: string;

    @ApiProperty({
        example: "Bombas1234",
        type: String,
    })
    password: string;
}
