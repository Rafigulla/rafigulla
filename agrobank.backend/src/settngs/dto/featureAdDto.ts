import { IsArray, IsJSON, IsNumber, IsNumberString, IsObject, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

class featureDto {
    @IsObject()
    @ApiProperty({type: Object, default: {uz: 'Uzbekcha', ru: "Ruscha", en: "Inglischa"}, description: 'Feature ad title'})
    title:object

    @IsObject()
    @ApiProperty({type: Object, default: {uz: 'Uzbekcha D', ru: "Ruscha D", en: "Inglischa D"}, description: 'Feature ad description'})
    description:object

    @IsObject()
    @ApiProperty({type: Object, default: {chips: {}}, description: 'Feature ad update link'})
    link:object

    @IsObject()
    @ApiProperty({type: Object, default: {uz: 'Uzbekcha link', ru: "Ruscha link", en: "Inglischa link"}, description: 'Feature ad update chips'})
    chips:object

    @IsString()
    @ApiProperty({type: String, default: '#fff', description: 'Feature ad update color'})
    color:string

    @IsString()
    @ApiProperty({type: String, default: "#fff", description: 'Feature ad update bg_color'})
    bg_color:string
   
}

class featureIdDto{ 
    @IsNumberString()
    @ApiProperty({type: Number, default: "3", description: 'Feature id'})
    id:number
}

export {featureDto,featureIdDto}