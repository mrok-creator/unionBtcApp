import { Controller, Get } from '@nestjs/common';
import { MetricService } from '../../services/metric/metric.service';

@Controller('metrics')
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  @Get()
  async getPrometheusMetrics(): Promise<string> {
    return await this.metricService.getPrometheusMetrics();
  }
}
