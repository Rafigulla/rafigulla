import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { AppService } from 'src/app.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[HttpModule],
  controllers: [DepositController],
  providers: [DepositService,AppService]
})
export class DepositModule {}
