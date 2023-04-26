import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { AppService } from 'src/app.service';
import { ResponseHelper } from 'src/helpers/response';
import { MyhomeController } from './myhome.controller';
import { MyhomeService } from './myhome.service';

@Module({
  imports: [HttpModule],
  controllers: [MyhomeController],
  providers: [MyhomeService, AppService, ResponseHelper]
})
export class MyhomeModule {}
