import { Controller, Get } from '@nestjs/common';
import { MetricService } from '../../services/metric/metric.service';
import { Metrics } from '../../shared/interface/metrics';

@Controller('metrics')
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  @Get()
  async getPrometheusMetrics(): Promise<Metrics> {
    return await this.metricService.getPrometheusMetrics();
  }
}
