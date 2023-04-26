import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class PassportDataDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Имя',
        default: 'Ашот'
    })
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Фамилия',
        default: 'Иванов'
    })
    surname: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Отчество',
        default: 'Иванович'
    })
    middleName: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Тип документа',
        default: 'ID or PASSPORT'
    })
    type: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Серия документа',
        default: 'AA'
    })
    serie: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Номер документа',
        default: '1234567'
    })
    number: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Место выдачи',
        default: 'Chilonzor IIB'
    })
    givenBy: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Дата выдачи',
        default: '01.01.2000'
    })
    givenDate: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Место рождения',
        default: 'Uzbekistan Tashkent'
    })
    birthPlace: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Дата рождения',
        default: '01.01.1990'
    })
    birthDate: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Срок документа',
        default: '01.01.2010'
    })
    expireDate: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'ИНН',
        default: '12345678'
    })
    inn: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'ПИНФЛ',
        default: '12345678'
    })
    pinfl: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Страна',
        default: 'Узбекистан'
    })
    country: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Регион, область',
        default: 'Ташкент'
    })
    region: string;

    @IsNotEmpty()
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