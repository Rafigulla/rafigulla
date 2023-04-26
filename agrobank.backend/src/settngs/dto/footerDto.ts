import { IsArray, IsJSON, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"; 

export class footerDto {
    @IsArray() 
    @IsOptional()
    @ApiProperty({type: Array, default:["1216","782018888"], description: 'Phone number list optional'})
    phone_numbers: Array<any>

    @IsArray()
    @IsOptional()
    @ApiProperty({type: Array<object>, default: [
        {
          "instagram": "https://www.instagram.com/agrobank_uz/"
        },
        {
          "youtube": "https://www.youtube.com/@Agrobankuzb"
        },
        {
          "telegram": "https://t.me/agrobankpress"
        },
        {
          "facebook": "https://www.facebook.com/agrobank.uz"
        },
        {
          "app_store": "https://apps.apple.com/uz/app/agrobank-mobile/id1451292895"
        },
        {
          "google_play": "https://apps.apple.com/uz/app/agrobank-mobile/id1451292895"
        }
    ], description: 'Social media link'})
    social_media:Array<object>
}