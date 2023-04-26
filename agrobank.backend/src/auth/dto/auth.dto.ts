import { IsPhoneNumber } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class AuthDto {
    @IsPhoneNumber('UZ') 
    @ApiProperty({type: String, default: "998902060398", description: 'Phone number'})
    phone: string
}