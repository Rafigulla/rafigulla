import { IsNumber, IsNumberString, IsObject, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class lastPlatejDto {
    @IsString() 
    @ApiProperty({type: String, default: 'payment', description: 'Platej Type'})
    type: string

    @IsNumberString() 
    @ApiProperty({type: String, default: 10, description: 'count'})
    count: string
}