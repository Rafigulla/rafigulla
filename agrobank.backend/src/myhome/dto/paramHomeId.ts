import { IsNumberString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class paramHomeId {
    @IsNumberString() 
    @ApiProperty({type: Number, default: 1, description: 'Home Id'})
    homeId: number
}