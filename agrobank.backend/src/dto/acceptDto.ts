import { IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class acceptDto {
    @IsString() 
    @ApiProperty({type: String, default: "35246", description: 'Kassa Id'})
    kassa_id: string
}