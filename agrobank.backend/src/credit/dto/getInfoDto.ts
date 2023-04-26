import { IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class getInfoDto {
    @IsString()
    @ApiProperty({type: String, default: "1", description: 'Credit Id'})
    credit_id: string
}