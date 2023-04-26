import { Controller } from '@nestjs/common';
import { Body, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreditService } from './credit.service';
import { getPnfilDto } from './dto';
import { getInfoDto } from './dto/getInfoDto';

@Controller('credit')
@ApiTags('credit')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access_token')
@ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: { default: 'ru' } })

export class CreditController {
    constructor(private service: CreditService){}

    @Get('get-loans')
    async getLoans(@Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.getLoans(res, req)
    }

    @Get('get-info/:credit_id')
    async getInfo(@Param() param:getInfoDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.getInfo(param, res, req)
    }

    @Post('getPnfil')
    async getPnfil(@Body() body:getPnfilDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.getPnfil(body, res, req)
    }
}
