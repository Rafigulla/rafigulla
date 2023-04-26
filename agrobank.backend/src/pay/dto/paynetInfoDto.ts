import { IsObject, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class panetInfoDto {

    @IsString() 
    @ApiProperty({type: String, default: "3513", description: 'Service id'})
    service_id: string

    @IsObject() 
    @ApiProperty({type: Object,  default: {"phone_number":"902060398"} ,description: 'Client id'})
    fields: {
        clientid: number
    }

    @IsString() 
    @ApiProperty({type: String, default:"Beeline", description: 'Service title'})
    serviceTitle: string
}