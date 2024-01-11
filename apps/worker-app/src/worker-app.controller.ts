import { Body, Controller, Post } from '@nestjs/common';
import { WorkerAppService } from './worker-app.service';

@Controller()
export class WorkerAppController {
  constructor(private readonly workerAppService: WorkerAppService) {}

  @Post('rate')
  async storeRateToDb(@Body('currentRate') currentRate: number) {
    return this.workerAppService.storeRate(currentRate);
  }

  @Post('metrics')
  async storeMetricsToDb(@Body('counterValue') counterValue: string) {
    return this.workerAppService.storeCounterMetrics(counterValue);
  }
}
