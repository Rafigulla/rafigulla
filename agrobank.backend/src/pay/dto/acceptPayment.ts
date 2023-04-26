import { IsNumber, IsObject, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class acceptPayDto {

    @IsString() 
    @ApiProperty({type: String, default: "c641e915-3756-40f3-967d-271a1c1114f6", description: 'Card uuid'})
    card_uuid: string

    @IsNumber() 
    @ApiProperty({type: Number, default: 6845, description: 'Kassa ID'})
    kassa_id: number
}