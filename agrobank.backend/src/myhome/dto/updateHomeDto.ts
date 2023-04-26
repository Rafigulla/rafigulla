import { IsNumber, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class updateHomeDto {
    @IsString() 
    @ApiProperty({type: String, default:'Mening uyim', description: 'Home new name'})
    name: string
}