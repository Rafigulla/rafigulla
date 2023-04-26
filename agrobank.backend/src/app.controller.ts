import { Body, Controller, Dependencies, Get, Post, Render } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller('v1/')
@ApiTags('logs')
@Dependencies(AppService)
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get("logpanel")
  @Render('index.html')
  home(){}

  @Post('getLog')
  getLog(@Body() body:any){
    return this.appService.getlogs(body)
  }
}
