import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { UuidDto } from 'src/dto';
import { VirtualCardService } from './virtual-card.service';
import { Request, Response } from 'express';
import { checkVirtualCardDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';


@Controller('v1/virtual-card')
@ApiTags('virtual-card')
@ApiBearerAuth('access_token')
@UseGuards(AuthGuard('jwt'))
@ApiHeader({ name: 'Auth-User-UUID', description: 'User uuid', schema: { default: '99eae575-12ae-48bb-8470-fd9e214b004e' } })
@ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: {default: 'ru'} })
export class VirtualCardController {
    constructor(private service: VirtualCardService){}

    @Get('/cardsList')
    async userData(@Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.getVirtualCardList(res, req)
    }

    @Post('/checkVirtualCard')
    async getLocalization(@Body() data: checkVirtualCardDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.checkVirtualCard(data, res, req)
    }

    @Post('/openVirtualCard')
    async openVirtualCard(@Body() data: checkVirtualCardDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.openVirtualCard(data, res, req)
    }
}
