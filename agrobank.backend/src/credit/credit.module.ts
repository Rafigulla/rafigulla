import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { CreditController } from './credit.controller';
import { CreditService } from './credit.service';
import { resText } from './responseText';

@Module({
  imports: [HttpModule],
  controllers: [CreditController],
  providers: [CreditService, resText, AppService]
})
export class CreditModule {}
