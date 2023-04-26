import { IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class sendSmsDto {
    @IsString() 
    @ApiProperty({type: String, default:'cvv', description: 'Sms Type'})
    type: string
}