import { IsNumber, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class deleteHomeDto {
    @IsString() 
    @ApiProperty({type: String, default:'99eae575-12ae-48bb-8470-fd9e214b004e', description: 'uuid'})
    uuid: string

    @IsString() 
    @ApiProperty({type: String, default:'1', description: 'Home Id'})
    homeId: string
}