import { Module } from '@nestjs/common';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { NestPgpromiseModule } from 'nestjs-pgpromise';
import { AppController } from './app.controller';
import { JwtModule } from "@nestjs/jwt";
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CardsModule } from './cards/cards.module';
import { WsModule } from './ws/ws.module';
import { PayModule } from './pay/pay.module';
import { MyhomeModule } from './myhome/myhome.module';
import { HttpModule } from '@nestjs/axios';
import { EImzoModule } from './e-imzo/e-imzo.module';
import { CreditModule } from './credit/credit.module';
import { PrismaModule } from './prisma/prisma.module';
import { P2pModule } from './p2p/p2p.module';
import { SettngsModule } from './settngs/settings.module';
import { JwtStrategy } from './strategy';
import { DepositModule } from './deposit/deposit.module';
import { VirtualCardModule } from './virtual-card/virtual-card.module';
import { NotificationModule } from './notification/notification.module';
import { ResponseHelper } from './helpers/response';


let config = new ConfigService()

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    NestPgpromiseModule.register({
      connection: {
          host: config.get('DATABASE_IP'),
          port: config.get('PORT'),
          database: config.get('DATABSE'),
          user: config.get('USER'),
          password: config.get('PASSWORD'),
      },
    }),
    HttpModule,
    AuthModule,
    CardsModule,
    WsModule,
    PayModule,
    MyhomeModule,
    EImzoModule,
    CreditModule,
    PrismaModule,
    P2pModule,
    SettngsModule,
    JwtModule.register({}),
    DepositModule,
    VirtualCardModule,
    NotificationModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
  exports: [AppService]
})
export class AppModule {}
