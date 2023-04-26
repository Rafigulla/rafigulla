import { Body, Controller, Get, Post, Put, Query, Param, Req, Res, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UuidDto } from 'src/dto';
import { createHomeDto, createHomeServiceDto, deleteHomeDto, homeServiceIdDto, paramHomeId, updateHomeDto, updateHomeServiceDto } from './dto';
import { MyhomeService } from './myhome.service';

@Controller('v1/myhome')
@ApiTags('MyHome')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access_token')
@ApiHeader({ name: 'Auth-User-UUID', description: 'User uuid', schema: { default: '99eae575-12ae-48bb-8470-fd9e214b004e' } })
@ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: { default: 'ru' } })

export class MyhomeController {
    constructor(private service: MyhomeService){}

    @Post('/')
    async myhomeCreate(@Body() body:createHomeDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.createHome(body, res, req)
    }

    @Get('/')
    async getHome(@Res() res:Response, @Req() req: Request ): Promise<any>{
        return await this.service.getHome(res, req)
    }

    @Put('/:homeId')
    async updateHome(@Param() param: paramHomeId, @Body() body:updateHomeDto, @Res() res: Response, @Req() req:Request): Promise<any>{
        return await this.service.updateHome(param, body,res,req)
    }

    @Delete('/:homeId')
    async deleteHome(@Param() param:paramHomeId, @Res() res: Response, @Req() req:Request): Promise<any>{
        return await this.service.deleteHome(param,res,req)
    }

    @Post('service')
    async createHomeService(@Body() body:createHomeServiceDto, @Res() res: Response, @Req() req:Request): Promise<any>{
        return await this.service.createHomeService(body,res,req)
    }

    @Get('services/:homeId')
    async getHomeService(@Param() param:paramHomeId, @Res() res: Response, @Req() req:Request): Promise<any>{
        return await this.service.getHomeService(param,res,req)
    }

    @Put('service/:serviceId')
    async updateHomeService( @Param() param: homeServiceIdDto, @Body() body:updateHomeServiceDto, @Res() res: Response, @Req() req:Request): Promise<any>{
        return await this.service.updateHomeService(param, body, res,req)
    }

    @Delete('service/:serviceId')
    async deleteHomeService(@Param() param:homeServiceIdDto, @Res() res: Response, @Req() req:Request): Promise<any> {
        return await this.service.deleteHomeService(param,res,req)
    }
}
