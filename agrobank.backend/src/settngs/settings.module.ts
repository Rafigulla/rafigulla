import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ResponseHelper } from 'src/helpers/response';
import { SettngsController } from './settings.controller';
import { SettngsControllerV2 } from './settings.controller.v2';
import { SettingsService } from './settings.service';
import { FeatureController } from './featureAd.controller';
import { AdminController } from './admin.controller';

@Module({
  imports: [HttpModule],
  controllers: [SettngsController, SettngsControllerV2, FeatureController,AdminController],
  providers: [SettingsService, AppService,ResponseHelper ]
})
export class SettngsModule {}
