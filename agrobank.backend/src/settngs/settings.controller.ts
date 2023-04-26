import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiParam, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UuidDto } from 'src/dto';
import { SettingsService } from './settings.service';
import { Request, Response } from 'express';
import { footerDto, localizationDto, PassportDataDto, sessionDto, UpdatePassportDataDto, UpdateUserDataDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

@Controller('v1/settings')
@ApiTags('settings')
@ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: {default: 'ru'} })
export class SettngsController {
    constructor(private service: SettingsService){}

    @Post('/getUserData')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async userData(@Body() userUuid: UuidDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.getUserData(userUuid, res, req)
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

    @Get('/check-passport/:uuid')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async checkPassport(@Param() data: UuidDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.checkPassport(data, res, req)
    }

    @Get('/passport/:uuid')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async getPassport(@Param() data: UuidDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.getPassport(data, res, req)
    }

    @Post('/passport')
    @UseInterceptors(AnyFilesInterceptor())
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async addPassport(@Body() data: PassportDataDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.addPassport(data, res, req)
    }

    @Put('/passport')
    @UseInterceptors(AnyFilesInterceptor())
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async updatePassport(@Body() data: UpdatePassportDataDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.updatePassport(null, data, res, req)
    }

    @Get('/getlocalization')
    async getLocalization(@Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.getLocalization(res, req)
    }

    @Get('/question/:type') 
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

    @Post('/sessions')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async sessions(@Body() userUuid: UuidDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.sessions(userUuid, res, req)
    }

    @Delete('/sessions/:uuid/:sessionId')
    @ApiBearerAuth('access_token')
    @UseGuards(AuthGuard('jwt'))
    async deleteSessions(@Param() userUuid: sessionDto, @Res() res: Response, @Req() req: Request): Promise<any>{        
        return await this.service.deleteSessions(userUuid, res, req)
    }
}
