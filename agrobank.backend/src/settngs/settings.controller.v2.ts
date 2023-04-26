import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiParam, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { Request, Response } from 'express';
import { featureDto, featureIdDto, footerDto, localizationDto, paramPassportId, PassportDataDto, sessionDto, UpdatePassportDataDto, UpdateUserDataDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

@Controller('v2/settings')
@ApiTags('v2/settings')
@ApiHeader({ name: 'Auth-User-UUID', description: 'User uuid', schema: { default: '99eae575-12ae-48bb-8470-fd9e214b004e' } })
@ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: {default: 'ru'} })
export class SettngsControllerV2 {
    constructor(private service: SettingsService){}

    @Get('/userdata')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async getUserData(@Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.getUserData(null, res, req)
    }

    @Post('/userdata')
    @ApiBearerAuth('access_token')
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            uuid: { type: 'string' },
            email: { type: 'string' },
            lastname: { type: 'string' },
            firstname: { type: 'string' },
            surname: { type: 'string' },
            checkphoto: { type: 'string' },
            image: {
              type: 'string',
              format: 'binary',
            },
          },
        },
    })
    @UseGuards(AuthGuard('jwt'))
    async createuserData(@Body() data: UpdateUserDataDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.createuserData(data, res, req)
    }

    @Get('/passport/check')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async checkPassport(@Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.checkPassport(null, res, req)
    }

    @Get('/passport')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async getPassport(@Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.getPassport(null, res, req)
    }

    @Post('/passport')
    @UseInterceptors(AnyFilesInterceptor())
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async addPassport(@Body() data: PassportDataDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.addPassport(data, res, req)
    }

    @Put('/passport/:passportId')
    @UseInterceptors(AnyFilesInterceptor())
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async updatePassport(@Param() param: paramPassportId, @Body() data: UpdatePassportDataDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.updatePassport(param, data, res, req)
    }

    @Get('/localization')
    async getLocalization(@Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.getLocalization(res, req)
    }

    @Get('/question/:type') 
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    @ApiParam({name: 'type', type: String, example: 'common'})
    async getquestion(@Param() params, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.getquestions(params,res, req)
    }

    @Get('/course/:type') 
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    @ApiParam({name: 'type', description: "agro || cb", type: String,  example: 'agro'})
    async getCourse(@Param() params, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.getCourse(params,res, req)
    }

    @Put('/localization')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async localization(@Body() json: localizationDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.localization(json, res, req)
    }

    @Get('/contacts')
    async getSocial( @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.getContacts(res, req)
    }

    @Put('/contacts')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async contacts(@Body() body: footerDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.contacts(body, res, req)
    }

    @Get('/sessions')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async sessions(@Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.sessions(null, res, req)
    }

    @Delete('/sessions/:sessionId')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async deleteSessions(@Param() sessionId: sessionDto, @Res() res: Response, @Req() req: Request): Promise<any>{        
        return await this.service.deleteSessions(sessionId, res, req)
    }
}
