import { IsDateString, IsNumber, IsNumberString, IsString, Length, Matches, Max, MaxLength, Min, min } from 'class-validator'

export class historyDto {
    
    @IsNumberString()
    @Length(16)
    @MaxLength(16)
    card_number: string

    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    date_from: string

    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    date_to: string

    @IsNumberString() 
    page: string
    
    @IsNumberString() 
    limit: string
}

