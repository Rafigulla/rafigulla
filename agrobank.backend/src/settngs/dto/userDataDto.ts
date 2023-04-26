import {IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateUserDataDto {

    @IsOptional()
    @ApiProperty({
        description: 'Электронная почта',
        default: 'example@gmail.com'
    })
    email?: string;

    @IsOptional()
    @ApiProperty({
        description: 'Имя пользователя',
        default: 'Иван'
    })
    firstname?: string;

    @IsOptional()
    @ApiProperty({
        description: 'Фамилия пользователя',
        default: 'Иванов'
    })
    lastname?: string;

    @IsOptional()
    @ApiProperty({
        description: 'Фамилия пользователя',
        default: 'Иванов'
    })
    surname?: string;

    @IsOptional()
    @ApiProperty({
        description: 'Картинка пользователя',
        default: false
    })
    checkphoto?: boolean
}