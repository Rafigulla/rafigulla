import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth,  ApiHeader, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { Request, Response } from 'express';
import { featureDto, featureIdDto, } from './dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('v2/featured-ads')
@ApiTags('v2/featured-ads')
@ApiHeader({ name: 'Auth-User-UUID', description: 'User uuid', schema: { default: '99eae575-12ae-48bb-8470-fd9e214b004e' } })
@ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: {default: 'ru'} })
export class FeatureController{
    constructor(private service: SettingsService){}

    @Get('/')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async getFeaturedAd( @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.getFeaturedAd(res, req)
    }

    @Post('/')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async FeaturedAdCreate(@Body() json: featureDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.featuredAdCreate(json, res, req)
    }

    @Put('/:id')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async featuredAdUpdate(@Param() param:featureIdDto, @Body() json: featureDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.featuredAdUpdate(param,json, res, req)
    }

    @Delete('/:id')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async featuredAdDelete(@Param() param:featureIdDto,  @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.featuredAdDelete(param, res, req)
    }

}
