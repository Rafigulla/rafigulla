import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ResponseHelper } from 'src/helpers/response';
import { VirtualCardController } from './virtual-card.controller';
import { VirtualCardService } from './virtual-card.service';

@Module({
  imports:[HttpModule],
  controllers: [VirtualCardController],
  providers: [VirtualCardService, AppService,ResponseHelper]
})
export class VirtualCardModule {}
