import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdatePassportDataDto {
    @IsString()
    @ApiProperty({
        description: 'Имя',
        default: 'Ашот'
    })
    name: string;
    
    @IsString()
    @ApiProperty({
        description: 'Имя',
        default: '13'
    })
    id: string;

    @IsString()
    @ApiProperty({
        description: 'Фамилия',
        default: 'Иванов'
    })
    surname: string;

    @IsString()
    @ApiProperty({
        description: 'Отчество',
        default: 'Иванович'
    })
    middleName: string;

    @IsString()
    @ApiProperty({
        description: 'Тип документа',
        default: 'ID or PASSPORT'
    })
    type: string;

    @IsString()
    @ApiProperty({
        description: 'Серия документа',
        default: 'AA'
    })
    serie: string;

    @IsString()
    @ApiProperty({
        description: 'Номер документа',
        default: '1234567'
    })
    number: string;

    @IsString()
    @ApiProperty({
        description: 'Место выдачи',
        default: 'Chilonzor IIB'
    })
    givenBy: string;

    @IsString()
    @ApiProperty({
        description: 'Дата выдачи',
        default: '01.01.2000'
    })
    givenDate: string;

    @IsString()
    @ApiProperty({
        description: 'Место рождения',
        default: 'Uzbekistan Tashkent'
    })
    birthPlace: string;

    @IsString()
    @ApiProperty({
        description: 'Дата рождения',
        default: '01.01.1990'
    })
    birthDate: string;

    @IsString()
    @ApiProperty({
        description: 'Срок документа',
        default: '01.01.2010'
    })
    expireDate: string;

    @IsString()
    @ApiProperty({
        description: 'ИНН',
        default: '12345678'
    })
    inn: string;

    @IsString()
    @ApiProperty({
        description: 'ПИНФЛ',
        default: '12345678'
    })
    pinfl: string;

    @IsString()
    @ApiProperty({
        description: 'Страна',
        default: 'Узбекистан'
    })
    country: string;

    @IsString()
    @ApiProperty({
        description: 'Регион, область',
        default: 'Ташкент'
    })
    region: string;

    @IsString()
    @ApiProperty({
        description: 'Адресс',
        default: 'Мукимий 12'
    })
    address: string;

    @ApiProperty({type:String, format:'binary'})
    passport_img1: {
        type: 'string',
        format: 'binary',
    }
    @ApiProperty({type:String, format:'binary'})
    passport_img2: {
        type: 'string',
        format: 'binary',
    }
    @ApiProperty({type:String, format:'binary'})
    passport_img3: {
        type: 'string',
        format: 'binary',
    }
}