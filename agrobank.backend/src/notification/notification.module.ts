import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ResponseHelper } from 'src/helpers/response';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [HttpModule],
  controllers: [NotificationController],
  providers: [NotificationService,AppService, ResponseHelper]
})
export class NotificationModule {}
