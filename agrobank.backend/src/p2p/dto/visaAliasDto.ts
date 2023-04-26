import { IsArray, IsNumber, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class visaAliasDto {
    @IsArray()
    @ApiProperty({
        type: Array<string>, 
        default: [
            "998977163484",
            "998903392627"
        ],
        description: 'uuid'
    })
    contacts: Array<any>
}