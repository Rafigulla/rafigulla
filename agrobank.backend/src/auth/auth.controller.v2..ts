import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { AuthDto, changePasswordDto, passwordVerifyDto, refreshDto, resendDto, smsDataDto } from './dto';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@Controller('v2/auth')
@ApiTags('v2/auth')
@ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: {default: 'ru'} })
export class AuthControllerV2 {
    constructor(private service: AuthService){}

    @Post('/login')
    async login(@Body() loginData: AuthDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.login(loginData,res,req)
    }

    @Post('/passwordverify')
    @ApiHeader({ name: 'Auth-User-UUID', description: 'User uuid', schema: { default: '99eae575-12ae-48bb-8470-fd9e214b004e' } })
    async checkPassword(@Body() passwordData: passwordVerifyDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.checkPassword(passwordData,res,req)
    }

    @Post('/checkSms')
    @ApiHeader({ name: 'Auth-User-UUID', description: 'User uuid', schema: { default: '99eae575-12ae-48bb-8470-fd9e214b004e' } })
    async checkSms(@Body() smsData: smsDataDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.checkSms(smsData,res,req)
    }

    @Post('/resend')
    @ApiHeader({ name: 'Auth-User-UUID', description: 'User uuid', schema: { default: '99eae575-12ae-48bb-8470-fd9e214b004e' } })
    async resend(@Body() resdata: resendDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.resendSms(resdata, res, req )
    }

    @Post('/forgetpassword')
    @ApiHeader({ name: 'Auth-User-UUID', description: 'User uuid', schema: { default: '99eae575-12ae-48bb-8470-fd9e214b004e' } })
    async forgetPassword(@Body() forgetData: resendDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.forgetPassword(forgetData, res, req )
    }

    @Post('/changepassword')
    @ApiHeader({ name: 'Auth-User-UUID', description: 'User uuid', schema: { default: '99eae575-12ae-48bb-8470-fd9e214b004e' } })
    async changePassword(@Body() changePassData: changePasswordDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.changePassword(changePassData, res, req )
    }

    @Post('/refresh')
    @ApiHeader({ name: 'Auth-User-UUID', description: 'User uuid', schema: { default: '99eae575-12ae-48bb-8470-fd9e214b004e' } })
    async refresh(@Body() forgetData: refreshDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.refresh(forgetData, res, req )
    }

    @Post('/logout')
    @ApiHeader({ name: 'Auth-User-UUID', description: 'User uuid', schema: { default: '99eae575-12ae-48bb-8470-fd9e214b004e' } })
    async logout(@Body() forgetData: refreshDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.logout(forgetData, res, req )
    }
}
