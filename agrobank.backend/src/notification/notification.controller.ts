import { Body, Controller, Get, Param, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UuidDto } from 'src/dto';
import { tokenDto, updateNewsDto, viewNewsDto } from './dto';
import { NotificationService } from './notification.service';

@Controller('v1/notifications')
@ApiTags('notifications')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access_token')
@ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: { default: 'ru' } })
@ApiHeader({ name: 'Auth-User-UUID', description: 'User uuid', schema: { default: '99eae575-12ae-48bb-8470-fd9e214b004e' } })
export class NotificationController {
    constructor(private service: NotificationService){}

    @Get('allNews')
    async getHome(@Res() res:Response, @Req() req: Request ): Promise<any>{
        return await this.service.allNews(res, req)
    }

    @Put('token')
    async updateToken(@Body() body:tokenDto, @Res() res:Response, @Req() req: Request ): Promise<any>{
        return await this.service.updateToken(body, res, req)
    }

    @Put('news')
    async updateNews(@Body() body:updateNewsDto, @Res() res:Response, @Req() req: Request ): Promise<any>{
        return await this.service.updateNews(body, res, req)
    }

    @Put('view')
    async view(@Body() body:viewNewsDto, @Res() res:Response, @Req() req: Request ): Promise<any>{
        return await this.service.view(body, res, req)
    }

    @Get('unreadCount')
    async unreadCount(@Res() res:Response, @Req() req: Request ): Promise<any>{
        return await this.service.unreadCount(res, req)
    }
}
