import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth,  ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { adminDto, adminIdDto, createAdminDto } from './dto';
import { UuidDto } from 'src/dto';

@Controller('v2/admins')
@ApiTags('v2/admins')
@ApiHeader({ name: 'Auth-User-UUID', description: 'User uuid', schema: { default: '99eae575-12ae-48bb-8470-fd9e214b004e' } })
@ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: {default: 'ru'} })
export class AdminController{
    constructor(private service: SettingsService){}

    @Get('/')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async admins(@Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.getAdmins(res, req)
    }

    @Post('/')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async createAdmin( @Body() body:createAdminDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.admin(null, {phone:body.phone, set: true}, res, req)
    }

    @Delete('/:id')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    @ApiParam({name: 'id', description: "Admin id", type: String})
    async deleteAdmin(@Param() param: adminIdDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.admin(param, {phone: "998901234567", set: false}, res, req)
    }

}
