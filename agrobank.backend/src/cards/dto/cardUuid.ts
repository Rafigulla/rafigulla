import { IsOptional, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class cardUuidDto {
    @IsString() 
    @ApiProperty({type: String, default:'a01340ec-0f67-48e8-8393-3944a4b82a09', description: 'Card uuid'})
    cardUuid: string
}