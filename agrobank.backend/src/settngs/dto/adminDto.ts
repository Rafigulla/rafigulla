import { IsArray, IsBoolean, IsJSON, IsNumber, IsNumberString, IsObject, IsOptional, IsPhoneNumber, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

class createAdminDto {
    @IsPhoneNumber('UZ')
    @ApiProperty({type: String, default: "998902060398", description: 'Phone number'})
    phone:string
}

class adminDto {
    @IsPhoneNumber('UZ')
    @ApiProperty({type: Boolean, default: "998902060398", description: 'Phone number'})
    phone:string
    
    @IsBoolean()
    @IsOptional()
    @ApiProperty({type: Boolean, default: true, description: 'Set Admin true or false'})
    set:boolean
}

class adminIdDto {
    @IsOptional()
    @IsNumberString()
    @ApiProperty({type: String, default: '3', description: 'Admin Id'})
    id:string
}

export {adminIdDto, adminDto, createAdminDto}