import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class updateCardDto {
    @IsOptional()
    @IsString() 
    @ApiProperty({type: String, default:'99eae575-12ae-48bb-8470-fd9e214b004e', description: 'uuid'})
    uuid: string

    @IsString() 
    @ApiProperty({type: String, default:'99eae575-12ae-48bb-8470-fd9e214b004e', description: 'uuid'})
    cardUuid: string

    @IsString() 
    @ApiProperty({type: String, default:'Humo card', description: 'Card to title'})
    title: string

    @IsNumber() 
    @ApiProperty({type: Number, default: 0, description: 'template id'})
    template: number

    @IsNumber() 
    @ApiProperty({type: Number, default:0, description: 'Main card'})
    makeMain: number

    @IsBoolean() 
    @ApiProperty({type: Boolean, default:false,  description: 'Main card'})
    changeMain: boolean
}