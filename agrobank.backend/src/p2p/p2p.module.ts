import { Module } from '@nestjs/common';
import { P2pService } from './p2p.service';
import { P2pController } from './p2p.controller';
import { HttpModule } from '@nestjs/axios';
import { AppService } from 'src/app.service';
import { ResponseHelper } from 'src/helpers/response';
import { P2pControllerV2 } from './p2p.controller.v2';

@Module({
  imports:[HttpModule],
  controllers: [P2pController,P2pControllerV2],
  providers: [P2pService,AppService, ResponseHelper]
})
export class P2pModule {}
