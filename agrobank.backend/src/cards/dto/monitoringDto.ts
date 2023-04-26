import {IsDefined, IsNotEmpty, IsNumberString, IsOptional, IsString, Matches, MaxLength, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class monitoringDto {
    @IsOptional()
    @IsString() 
    @ApiProperty({type: String, default:'99eae575-12ae-48bb-8470-fd9e214b004e', description: 'uuid'})
    uuid: string


    @IsString()
    @ApiProperty({
        description: 'Уникальный ID карты',
        default: '1aab4579-284b-4d7b-83a6-018af702b519'
    })
    cardUuid: string

    @IsDefined()
    @ApiProperty({
        description: 'Тип мониторинга, C - приход, D - расход',
        default: 'D'
    })
    monitoringType: string

    @IsDefined()
    @ApiProperty({
        description: 'from date',
        default: '2023-02-03'
    })
    fromDate: string

    @IsDefined()
    @ApiProperty({
        description: 'to date',
        default: '2023-03-03'
    })
    toDate: string

    @IsDefined()
    @ApiProperty({
        description: 'Месяц мониторинга',
        default: '5'
    })
    month: string

    @IsDefined()
    @ApiProperty({
        description: 'Год мониторинга',
        default: '2022'
    })
    year: string

    @IsNumberString()
    @ApiProperty({
        description: 'Страница',
        default: '1'
    })
    page:string

    @IsNumberString()
    @ApiProperty({
        description: 'Размер страницы',
        default: '50'
    })
    pageSize:string
}