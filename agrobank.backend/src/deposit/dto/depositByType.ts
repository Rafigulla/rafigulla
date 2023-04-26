import { IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class depositByTypeDto {
    @IsString() 
    @ApiProperty({type: String, default:'99eae575-12ae-48bb-8470-fd9e214b004e', description: 'uuid'})
    uuid: string

    @IsString() 
    @ApiProperty({type: String, default:'online_progress', description: 'Deposti type'})
    type: string
}