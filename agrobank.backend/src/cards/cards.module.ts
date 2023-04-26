import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { WsModule } from 'src/ws/ws.module';
import { AppService } from 'src/app.service';
import { ResponseHelper } from 'src/helpers/response';
import { CardsControllerV2 } from './cards.controller.v2';

@Module({
  imports: [WsModule,HttpModule],
  controllers: [CardsController, CardsControllerV2],
  providers: [CardsService, AppService, ResponseHelper]
})

export class CardsModule {}
