import { IsJSON, IsNotEmpty, IsObject, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class checkVirtualCardDto {
    @IsString() 
    @ApiProperty({type: String, default: 'visa_uzs|visa_usd|humo_uzs', description: 'uuid'})
    type: string
}