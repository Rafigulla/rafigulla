import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from 'src/app.service';
import { ResponseHelper } from 'src/helpers/response';
import { AuthController } from './auth.controller';
import { AuthControllerV2 } from './auth.controller.v2.';
import { AuthService } from './auth.service';

@Module({
  imports: [HttpModule],
  controllers: [AuthController, AuthControllerV2],
  providers: [AuthService,AppService, ResponseHelper]
})
export class AuthModule {}
