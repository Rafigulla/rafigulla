import { IsNumber, IsObject, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class createHomeServiceDto {    
    @IsNumber() 
    @ApiProperty({type: Number, default:1, description: 'Home Id'})
    homeId: number
    
    @IsNumber() 
    @ApiProperty({type: Number, default:1, description: 'Home Id'})
    partnerId: number
    
    @IsString() 
    @ApiProperty({type: String, default:"998902060398", description: 'uuid'})
    partnerNumber: string
    
    @IsObject() 
    @ApiProperty({
        type: Object, 
        default: {
            service_id: 4386,
            fields:{
                clientid:"902060398",
                amount: "500"
            }
        }, 
        description: 'uuid'
    })
    payData: {
        service_id: number,
        fields: object
    }
}