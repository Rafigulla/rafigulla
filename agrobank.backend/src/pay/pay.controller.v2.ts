import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Param, Query } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { panetInfoDto, ServiceListDto,createPayDto, acceptPayDto, lastPlatejDto, getTrDto } from './dto';
import { PayService } from './pay.service';

@Controller('v2/pay')
@ApiTags('v2/pay')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access_token')
@ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: { default: 'ru' } })
@ApiHeader({ name: 'Auth-User-UUID', description: 'User uuid', schema: { default: '99eae575-12ae-48bb-8470-fd9e214b004e' } })
export class PayControllerV2 {
    constructor(private service: PayService) {}

    @Get('categories')
    async categoryList(@Res() res: Response, @Req() req: Request) {
        return this.service.categoryList(null, res, req)
    }

    @Get('categories/:category_id')
    async servicelist(@Param() param: ServiceListDto, @Res() res: Response, @Req() req: Request) {
        return this.service.serviceList(param, res, req)
    }

    @Post('paynetinfo')
    async paynetInfo(@Body() body: panetInfoDto, @Res() res: Response, @Req() req: Request) {
        return this.service.paynetInfo(body, res, req)
    }

    @Post('createpayment')
    async createpayment(@Body() body: createPayDto, @Res() res: Response, @Req() req: Request) {
        return this.service.createpayment(body, res, req)
    }

    @Post('acceptpayment')
    async acceptpayment(@Body() body: acceptPayDto, @Res() res: Response, @Req() req: Request) {
        return this.service.acceptpayment(body, res, req)
    }

    @Get('lastpayments')
    async getlastpayment(@Query() query: lastPlatejDto, @Res() res: Response, @Req() req: Request) {
        return this.service.getlastpayment(query, res, req)
    }

    @Get('transaction/:kassaId')
    async getTransaction(@Param() param: getTrDto, @Res() res: Response, @Req() req: Request) {
        return this.service.getTransaction(param, res, req)
    }

    @Get('allservices')
    @UseGuards(AuthGuard('jwt'))
    async allservices( @Res() res: Response, @Req() req: Request) {
        return this.service.allServices(res, req)
    }

}
