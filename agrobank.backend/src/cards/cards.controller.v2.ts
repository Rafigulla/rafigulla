import { Body, Controller, Delete, Post, Req, Res } from '@nestjs/common';
import { Get, Put, UseGuards } from '@nestjs/common/decorators';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UuidDto } from 'src/dto';
import { CardsService } from './cards.service';
import { addCardDto, cardUuidDto, checkSmsDto, getSmsDto, monitoringDto, sendSmsDto, unverDto, updateCardDto } from './dto';

@Controller('v2/cards')
@ApiTags('v2/cards')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access_token')
@ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: { default: 'ru' } })
@ApiHeader({ name: 'Auth-User-UUID', description: 'User uuid', schema: { default: '99eae575-12ae-48bb-8470-fd9e214b004e' } })
export class CardsControllerV2 {
    constructor(private service: CardsService){}

    @Post('/')
    async addcard(@Body() body: addCardDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.addcard(body, res, req)
    }

    @Post('/checksms')
    async checksms(@Body() body: checkSmsDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.checksms(body, res, req)
    }

    @Get('/')
    async getUserallCards(@Res() res: Response, @Req() req: Request) {
        return await this.service.getUserallCards(null, res, req)
    }
    
    @Post('/monitoring')
    async monitoring(@Body() body: monitoringDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.monitoring(body, res, req)
    }
    
    @Delete('/:cardUuid')
    async deleteCard(@Param() param: cardUuidDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.deleteCard(param, res, req)
    }

    @Get('/:cardUuid/templates')
    async getTemplates(@Param() param: cardUuidDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.getTemplates(param, res, req)
    }

    @Put('/:cardUuid')
    async update(@Param() param: cardUuidDto, @Body() body: updateCardDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.update(body, param, res, req)
    }

    @Get('/:cardUuid')
    async info(@Param() param: cardUuidDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.info(param, res, req)
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
