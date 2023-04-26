import { IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class getP2PinfoDto {
    @IsString() 
    @ApiProperty({type: String, default:'8600042388825936', description: 'Card number'})
    pan: string

    @IsString() 
    @ApiProperty({type: String, default:'902060398', description: 'Phone number'})
    phone: string

    @IsString() 
    @ApiProperty({type: String, default:'John Doe', description: 'Firstname'})
    fio: string
}