import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AdministradorModule } from './modules/administrador/administrador.module';

import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './jwt/auth.module';

import { MongooseModule } from '@nestjs/mongoose';
import { DashboardModule } from './iot/dashboard/dashboard.module';
import { DashboardService } from './iot/dashboard/dashboard.service';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    AdministradorModule,
    PrismaModule,
    ScheduleModule.forRoot(),
  
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DashboardModule,
  ],

  providers: [AppService,DashboardService],
})
export class AppModule {}
