import { Body, Controller, Delete, Post, Req, Res } from '@nestjs/common';
import { Put, UseGuards } from '@nestjs/common/decorators';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UuidDto } from 'src/dto';
import { CardsService } from './cards.service';
import { addCardDto, checkSmsDto, getSmsDto, monitoringDto, sendSmsDto, unverDto, updateCardDto } from './dto';

@Controller('v1/cards')
@ApiTags('cards')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access_token')
@ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: { default: 'ru' } })
export class CardsController {
    constructor(private service: CardsService){}

    @Post('/addcard')
    async addcard(@Body() body: addCardDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.addcard(body, res, req)
    }

    @Post('/checksms')
    async checksms(@Body() body: checkSmsDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.checksms(body, res, req)
    }

    @Post('/getuserallcards')
    async getUserallCards(@Body() body: UuidDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.getUserallCards(body, res, req)
    }
    
    @Post('/monitoring')
    async monitoring(@Body() body: monitoringDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.monitoring(body, res, req)
    }
    
    @Delete('/:uuid/:cardUuid')
    async deleteCard(@Param() param: unverDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.deleteCard(param, res, req)
    }

    @Post('/updatedata')
    async updatedata(@Body() body: unverDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.getTemplates(body, res, req)
    }

    @Put('/update')
    async update(@Body() body: updateCardDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.update(body, {cardUuid: body.cardUuid}, res, req)
    }

    @Post('/info')
    async info(@Body() body: unverDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.info(body, res, req)
    }

    @Post('/block')
    async block(@Body() body: unverDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.block(body, res, req)
    }

    @Post('/sendsms')
    async sendsms(@Body() body: sendSmsDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.sendsms(body, res, req)
    }

    @Post('/getcvv')
    async getcvv(@Body() body: getSmsDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.getcvv(body, res, req)
    }

    @Post('/setPinCode')
    async setpincode(@Body() body: getSmsDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.setPinCode(body, res, req)
    }
}
