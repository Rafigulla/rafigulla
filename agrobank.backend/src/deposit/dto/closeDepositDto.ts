import { IsNumber, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class closeDepostDto {
    @IsString() 
    @ApiProperty({type: String, default:'99eae575-12ae-48bb-8470-fd9e214b004e', description: 'uuid'})
    uuid: string

    @IsString() 
    @ApiProperty({type: String, default:'string', description: 'Code deposit'})
    code: string

    @IsString() 
    @ApiProperty({type: String, default:'uzs', description: 'Currency UZS || USD'})
    currency: string

    @IsString() 
    @ApiProperty({type: String, default: 0, description: 'Amount '})
    book_id: string
    
    @IsString() 
    @ApiProperty({type: String, default:'a01340ec-0f67-48e8-8393-3944a4b82a09', description: 'Card Uuid'})
    cardUuid: string
}