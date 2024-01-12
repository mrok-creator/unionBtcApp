import { Body, Controller, Post } from '@nestjs/common';
import { WorkerAppService } from './worker-app.service';
import { Metrics } from './shared/interface/metrics';

@Controller()
export class WorkerAppController {
  constructor(private readonly workerAppService: WorkerAppService) {}

  @Post('rate')
  async storeRateToDb(@Body('currentRate') currentRate: number) {
    return this.workerAppService.storeRate(Number(currentRate));
  }

  @Post('metrics')
  async storeMetricsToDb(@Body() body: Metrics) {
    return this.workerAppService.storeCounterMetrics(body);
  }
}
