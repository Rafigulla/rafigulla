import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { acceptDto, UuidDto } from 'src/dto';
import { DepositService } from './deposit.service';
import { depositByTypeDto, getMoneyDto, myDepositDto, openDepostDto, putMoneyDto, closeDepostDto, getVisaListDto } from './dto';

@Controller('v1/deposit')
@ApiTags('deposit')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access_token')
@ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: { default: 'ru' } })

export class DepositController {
    constructor(private service: DepositService){}

    @Post('myDeposit')
    mydeposit(@Body() body:myDepositDto, @Res() res: Response, @Req() req: Request){
        return this.service.mydeposit(body, res, req)
    }

    @Post('getDepositList')
    getDepositList(@Body() body:UuidDto, @Res() res: Response, @Req() req: Request){
        return this.service.getDepositList(body, res, req)
    }

    @Post('getDepositByType')
    getDepositByType(@Body() body:depositByTypeDto, @Res() res: Response, @Req() req: Request){
        return this.service.getDepositByType(body, res, req)
    }

    @Post('openDeposit')  
    openDeposit(@Body() body:openDepostDto, @Res() res: Response, @Req() req: Request){
        return this.service.openDeposit(body, res, req)
    }

    @Post('putMoneyDeposit')  
    putMoneyDeposit(@Body() body:putMoneyDto, @Res() res: Response, @Req() req: Request){
        return this.service.putMoneyDeposit(body, res, req)
    }

    @Post('getMoneyDeposit')  
    getMoneyDeposit(@Body() body:getMoneyDto, @Res() res: Response, @Req() req: Request){
        return this.service.getMoneyDeposit(body, res, req)
    }

    @Post('closeDepost')  
    closeDeposit(@Body() body:closeDepostDto, @Res() res: Response, @Req() req: Request){
        return this.service.closeDeposit(body, res, req)
    }

    @Post('openDepositAccept')  
    openDepositAccept(@Body() body:acceptDto, @Res() res: Response, @Req() req: Request){
        return this.service.openDepositAccept(body, res, req)
    }

    @Post('putMoneyDepositAccept')  
    putMoneyDepositAccept(@Body() body:acceptDto, @Res() res: Response, @Req() req: Request){
        return this.service.putMoneyDepositAccept(body, res, req)
    }

    @Post('closeMoneyDepositAccept')  
    closeMoneyDepositAccept(@Body() body:acceptDto, @Res() res: Response, @Req() req: Request){
        return this.service.closeMoneyDepositAccept(body, res, req)
    }

    @Post('getMoneyDepositAccept')  
    getMoneyDepositAccept(@Body() body:acceptDto, @Res() res: Response, @Req() req: Request){
        return this.service.getMoneyDepositAccept(body, res, req)
    }

    @Post('getVisaCardList')  
    getVisaCardList(@Body() body:getVisaListDto, @Res() res: Response, @Req() req: Request){
        return this.service.getVisaCardList(body, res, req)
    }

    @Post('getAgroCardList')  
    getAgroCardList(@Body() body:UuidDto, @Res() res: Response, @Req() req: Request){
        return this.service.getAgroCardList(body, res, req)
    }
}
