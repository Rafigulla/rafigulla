import { IsJSON, IsNotEmpty, IsObject } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class localizationDto {
    @IsObject() 
    @ApiProperty({type: Object, default: {}, description: 'Json Object'})
    json: object
}