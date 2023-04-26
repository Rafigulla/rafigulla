import { IsNumberString, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class ServiceListDto {
    @IsNumberString() 
    @ApiProperty({type: String, default: '1', description: 'Category id'})
    category_id: string
}