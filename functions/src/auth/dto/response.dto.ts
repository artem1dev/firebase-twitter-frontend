import { ApiProperty } from "@nestjs/swagger";

export class ResponseAuthDto {
    @ApiProperty({
        description: "JWT token for this User",
        example: "asdasdasdasda",
        type: String,
    })
    token: string;
    
    @ApiProperty({
        example: true,
        type: String,
    })
    userId: string;
}
