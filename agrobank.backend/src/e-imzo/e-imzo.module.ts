import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { EImzoController } from './e-imzo.controller';
import { EImzoService } from './e-imzo.service';

@Module({
  imports:[HttpModule],
  controllers: [EImzoController],
  providers: [EImzoService, AppService]
})
export class EImzoModule {}
