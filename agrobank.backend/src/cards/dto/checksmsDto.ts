import { IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class checkSmsDto {
    @IsString() 
    @ApiProperty({type: String, default:'12345', description: 'Sms code'})
    smsCode: string

    @IsString() 
    @ApiProperty({type: String, default:'df9089ae-ef12-4b91-8777-342a1976dcb1', description: 'Card uuid'})
    cardUuid: string


}