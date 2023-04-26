import { IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class viewNewsDto {
    @IsString() 
    @ApiProperty({type: Number, default:1, description: 'New ID'})
    newsId: number
}