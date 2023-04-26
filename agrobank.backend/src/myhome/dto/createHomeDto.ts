import { IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class createHomeDto {
    @IsString() 
    @ApiProperty({type: String, default:'Mening uyim', description: 'My home name'})
    name: string
}