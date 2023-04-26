import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UuidDto } from 'src/dto';
import { acceptDto } from 'src/dto';
import { createP2PDto, getP2PinfoDto } from './dto';
import { visaAliasDto } from './dto/visaAliasDto';
import { P2pService } from './p2p.service';


@Controller('v1/p2p')
@ApiTags('p2p')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access_token')
@ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: { default: 'ru' } })
export class P2pController  {
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

    @Post('/transactionslist')
    async transactionslist(@Body() body: UuidDto, @Res() res: Response, @Req() req: Request) {
        return await this.service.transactionslist(body, res, req)
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
