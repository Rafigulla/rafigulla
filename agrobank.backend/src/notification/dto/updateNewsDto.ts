import { IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class updateNewsDto {
    @IsNumber() 
    @ApiProperty({type: Number, default:1, description: 'News id'})
    newsId: number

    @IsString() 
    @ApiProperty({type: String, default:'like or view', description: 'Когда параметр нравится, последний параметр нравится, в противном случае это вид'})
    param: string

    @IsString() 
    @IsOptional()
    @ApiProperty({type: String, default:'1 or 0', description: '1 добавляет лайки, 0 уменьшает лайки на единицу'})
    like: string
    
    @IsString() 
    @IsOptional()
    @ApiProperty({type: String, default:'1 or 0', description: '1 добавляет лайки, 0 уменьшает лайки на единицу'})
    view: string
}