import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BusinessDateService } from './business.date.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, BusinessDateService],
})
export class AppModule {}
