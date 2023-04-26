import { IsNumber, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class addCardDto {
    @IsString() 
    @ApiProperty({type: String, default:'9860350102464210', description: 'Card Number'})
    pan: string
    
    @IsString() 
    @ApiProperty({type: String, default:'0926', description: 'Expair Date'})
    expiry: string

    @IsString() 
    @ApiProperty({type: String, default:'Humo card', description: 'Card to title'})
    title: string

    @IsNumber() 
    @ApiProperty({type: Number, default:0, description: 'Main card'})
    is_main: number

    @IsNumber() 
    @ApiProperty({type: Number, default:0, description: 'Id Shablon'})
    template_id: number
}