import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UuidDto } from 'src/dto';
import { panetInfoDto, ServiceListDto,createPayDto, acceptPayDto, lastPlatejDto, getTrDto } from './dto';
import { PayService } from './pay.service';

@Controller('v1/pay')
@ApiTags('pay')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access_token')
@ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: { default: 'ru' } })

export class PayController {
    constructor(private service: PayService) {}

    @Post('categorylist')
    async categoryList(@Body() body: UuidDto, @Res() res: Response, @Req() req: Request) {
        return this.service.categoryList(body, res, req)
    }

    @Post('servicelist')
    async servicelist(@Body() body: ServiceListDto, @Res() res: Response, @Req() req: Request) {
        return this.service.serviceList(body, res, req)
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

    @Post('getlastpayment')
    async getlastpayment(@Body() body: lastPlatejDto, @Res() res: Response, @Req() req: Request) {
        return this.service.getlastpayment(body, res, req)
    }

    @Post('getTransaction')
    async getTransaction(@Body() body: getTrDto, @Res() res: Response, @Req() req: Request) {
        return this.service.getTransaction(body, res, req)
    }

    @Get('allservices')
    @UseGuards(AuthGuard('jwt'))
    async allservices( @Res() res: Response, @Req() req: Request) {
        return this.service.allServices(res, req)
    }

}
