import { IsNumber, IsNumberString, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class homeServiceIdDto {
    @IsNumberString() 
    @ApiProperty({type: String, default:"1", description: 'Service Id'})
    serviceId: string
}