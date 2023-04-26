import { IsNumber, IsNumberString, IsObject, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class getTrDto {
    @IsNumberString() 
    @ApiProperty({type: Number, default: 1879, description: 'Kassa ID'})
    kassaId: number
}