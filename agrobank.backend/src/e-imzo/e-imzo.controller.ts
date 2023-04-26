import { Controller } from '@nestjs/common';
import { Body, Post, Req, Res } from '@nestjs/common/decorators';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { eImzoDto } from './dto/eimzo.dto';
import { EImzoService } from './e-imzo.service';

@Controller('v1/e-imzo')
@ApiTags('e-imzo')
@ApiHeader({ name: 'Accept-Language', description: 'Default ru', schema: { default: 'ru' } })
export class EImzoController {
    constructor(private service: EImzoService){}

    @Post('/verify')
    verifyHash(@Body() body: eImzoDto, @Res() res: Response, @Req() req: Request) {
      return this.service.verifyHash(body, res, req)   
    }
}
