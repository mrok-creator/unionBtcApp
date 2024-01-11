import { Controller, Get, Post } from '@nestjs/common';
import { RateService } from '../../services/rate/rate.service';

@Controller('rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get()
  async getCurrentRate(): Promise<number> {
    return await this.rateService.getCurrentRate();
  }

  @Post('send')
  async sendRateEmails(): Promise<string[]> {
    return this.rateService.sendRateEmails();
  }
}
