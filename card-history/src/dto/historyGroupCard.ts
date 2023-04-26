import { IsArray, IsDateString, IsNumber, IsNumberString, IsString, Length, Matches, Max, MaxLength, Min, min } from 'class-validator'

export class historyGroupDto {
    
    @IsArray()
    cards: Array<string>

    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    date_from: string

    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    date_to: string

    @IsNumberString() 
    page: string
    
    @IsNumberString() 
    limit: string
}

