import { IsDateString, IsNumber, IsNumberString, IsString, Length, Matches, Max, MaxLength, Min, min } from 'class-validator'

export class historyUzcardDto {
    
    @IsString()
    card_token: string

    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    date_from: string

    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    date_to: string

    @IsNumberString() 
    page: string
    
    @IsNumberString() 
    limit: string
}

