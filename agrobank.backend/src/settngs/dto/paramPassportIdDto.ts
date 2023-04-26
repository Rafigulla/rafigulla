import { IsJSON, IsNotEmpty, IsNumber, IsNumberString, IsObject } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class paramPassportId {
    @IsNumberString() 
    @ApiProperty({type: String, default: 1, description: 'Passport id'})
    passportId: String
}