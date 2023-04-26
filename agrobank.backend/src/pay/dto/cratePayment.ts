import { IsNumber, IsObject, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class createPayDto {
    @IsString() 
    @ApiProperty({type: String, default: 4, description: 'Partner id'})
    partnerId: string

    @IsNumber() 
    @ApiProperty({type: Number, default: 50000, description: 'Amount'})
    amount: number

    @IsString() 
    @ApiProperty({type: String, default:"902060398", description: 'Partner number'})
    partnerNumber: string

    @IsObject() 
    @ApiProperty({type: Object,  default: {"fields": {phone_number: '902060398', summa: 500}, service_id: 2  } ,description: 'Pay data'})
    payData: object

}