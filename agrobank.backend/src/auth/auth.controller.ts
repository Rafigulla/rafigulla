import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { AuthDto, changePasswordDto, passwordVerifyDto, refreshDto, resendDto, smsDataDto } from './dto';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@Controller('v1/auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private service: AuthService){}

    @Post('/login')
    @ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: {default: 'ru'} })
    async login(@Body() loginData: AuthDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.login(loginData,res,req)
    }

    @Post('/passwordverify')
    @ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: {default: 'ru'} })
    async checkPassword(@Body() passwordData: passwordVerifyDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.checkPassword(passwordData,res,req)
    }

    @Post('/checkSms')
    @ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: {default: 'ru'} })
    async checkSms(@Body() smsData: smsDataDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.checkSms(smsData,res,req)
    }

    @Post('/resend')
    @ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: {default: 'ru'} })
    async resend(@Body() resdata: resendDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.resendSms(resdata, res, req )
    }

    @Post('/forgetpassword')
    @ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: {default: 'ru'} })
    async forgetPassword(@Body() forgetData: resendDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.forgetPassword(forgetData, res, req )
    }

    @Post('/changepassword')
    @ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: {default: 'ru'} })
    async changePassword(@Body() changePassData: changePasswordDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.changePassword(changePassData, res, req )
    }

    @Post('/refresh')
    @ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: {default: 'ru'} })
    async refresh(@Body() forgetData: refreshDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.refresh(forgetData, res, req )
    }

    @Post('/logout')
    @ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: {default: 'ru'} })
    async logout(@Body() forgetData: refreshDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        return await this.service.logout(forgetData, res, req )
    }

    
}
