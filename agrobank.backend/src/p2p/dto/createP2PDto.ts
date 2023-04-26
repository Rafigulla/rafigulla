import { IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class createP2PDto {
    @IsString() 
    @ApiProperty({type: String, default:'aece51cc-5a72-4c06-8731-7629e8c420ec', description: 'Card From'})
    cardFrom: string

    @IsString() 
    @ApiProperty({type: String, default:'9860300101975131', description: 'Card to'})
    cardTo: string

    @IsNumber() 
    @ApiProperty({type: Number, default:'500000', description: 'Amount'})
    amount: number

    @IsString() 
    @ApiProperty({type: String, default:'John Doe', description: 'FIO'})
    fio: string

    @IsString() 
    @IsOptional()
    @ApiProperty({type: String, default:'for dinner', description: 'Comment'})
    message: string
}