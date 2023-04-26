import { IsOptional, IsString, Length, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class getSmsDto {
    @IsString() 
    @ApiProperty({type: String, default:'df9089ae-ef12-4b91-8777-342a1976dcb1', description: 'Sms Type'})
    cardUuid: string

    @IsString() 
    @ApiProperty({type: String, default:'168462', description: 'SMS Code'})
    smsCode: string

    @IsString()
    @MaxLength(4)
    @MinLength(4)
    @IsOptional()
    @ApiProperty({type: String, default:'1111', description: 'Pin Code'})
    pin:string
}