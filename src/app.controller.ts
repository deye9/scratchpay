import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from './app.service';
import { BusinessDateService } from './business.date.service';
import { InputData } from './input.data';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly businessDateService: BusinessDateService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/api/v1/businessDates')
  getBusinessDate(@Query() query: InputData) {
    // we assume correct data will be input. No need to validate maybe later end
    const date: Date = new Date(query.initialDate);
    return this.businessDateService.getDate(date, query.delay, query.country);
  }

  @Post('/api/v1/businessDates')
  @HttpCode(HttpStatus.OK)
  postBusinessDate(@Body() payload: InputData) {
    // we assume correct data will be input. No need to validate maybe later end
    const date: Date = new Date(payload.initialDate);
    return this.businessDateService.getDate(
      date,
      payload.delay,
      payload.country,
    );
  }
}
