import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UuidDto } from 'src/dto';
import { acceptDto } from 'src/dto';
import { createP2PDto, getP2PinfoDto } from './dto';
import { visaAliasDto } from './dto/visaAliasDto';
import { P2pService } from './p2p.service';


@Controller('v2/p2p')
@ApiTags('v2/p2p')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access_token')
@ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: { default: 'ru' } })
@ApiHeader({ name: 'Auth-User-UUID', description: 'User uuid', schema: { default: '99eae575-12ae-48bb-8470-fd9e214b004e' } })
export class P2pControllerV2  {
    constructor(private service: P2pService){}

    @Post('/getInfo')
    async getInfo(@Body() body: getP2PinfoDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.getInfo(body, res, req)
    }
    
    @Post('/create')
    async monitoring(@Body() body: createP2PDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.create(body, res, req)
    }

    @Post('/accept')
    async accept(@Body() body: acceptDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.accept(body, res, req)
    }

    @Get('/transactionslist')
    async transactionslist(@Res() res: Response, @Req() req: Request) {
        return await this.service.transactionslist(null, res, req)
    }

    @Post('/visaAliasPage')
    async visaAliasPage(@Body() body: visaAliasDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.visaAliasPage(body, res, req)
    }

    @Post('/visaCreate')
    async visaCreate(@Body() body: createP2PDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.visaCreate(body, res, req)
    }
}
