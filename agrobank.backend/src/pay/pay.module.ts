import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ResponseHelper } from 'src/helpers/response';
import { WsModule } from 'src/ws/ws.module';
import { PayController } from './pay.controller';
import { PayControllerV2 } from './pay.controller.v2';
import { PayService } from './pay.service';

@Module({
  imports: [WsModule,HttpModule],
  controllers: [PayController, PayControllerV2],
  providers: [PayService, AppService, ResponseHelper]
})
export class PayModule {}
