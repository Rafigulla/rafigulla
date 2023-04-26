import { IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class getPnfilDto {
    @IsString()
    @ApiProperty({type: String, default: "50706035210029", description: 'Pnfil'})
    pnfil: string
}