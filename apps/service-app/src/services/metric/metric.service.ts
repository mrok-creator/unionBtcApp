import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Counter, Gauge, register } from 'prom-client';
import { Metrics } from '../../shared/interface/metrics';

@Injectable()
export class MetricService {
  private emailSubscribedCounter: Counter;
  private emailUnsubscribedCounter: Counter;
  private emailSentCounter: Counter;
  private emailErrorCounter: Counter;
  private rateGauge: Gauge;

  constructor() {
    this.initializeCounters();
    this.rateGauge = new Gauge({
      name: 'exchange_rate',
      help: 'Current BTC UAH exchange rate',
    });
  }

  private initializeCounters() {
    this.emailSubscribedCounter = new Counter({
      name: 'email_subscribed',
      help: 'Number of emails subscribed',
    });

    this.emailUnsubscribedCounter = new Counter({
      name: 'email_unsubscribed',
      help: 'Number of emails unsubscribed',
    });

    this.emailSentCounter = new Counter({
      name: 'email_sent',
      help: 'Number of emails sent',
    });

    this.emailErrorCounter = new Counter({
      name: 'email_error',
      help: 'Number of email sending errors',
    });
  }

  incrementEmailSubscribedCounter(): void {
    this.emailSubscribedCounter.inc();
  }

  incrementEmailUnsubscribedCounter(): void {
    this.emailUnsubscribedCounter.inc();
  }

  incrementEmailSentCounter(): void {
    this.emailSentCounter.inc();
  }

  incrementEmailErrorCounter(): void {
    this.emailErrorCounter.inc();
  }

  setRateGaugeValue(value: number): void {
    this.rateGauge.set(value);
  }
  async getPrometheusMetrics(): Promise<Metrics> {
    const counters = await register.metrics();
    const metrics = await this.parsePrometheusString(counters);
    await this.savePrometheusMetrics(metrics);
    return metrics;
  }

  async savePrometheusMetrics(metrics): Promise<void> {
    await axios.post('http://localhost:8090/metrics/', metrics, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async parsePrometheusString(counters: string) {
    const lines = counters.split('\n');
    const metrics: { [key: string]: number } = {};

    for (const line of lines) {
      if (line !== '' && !line.startsWith('#')) {
        const [metricName, metricValueStr] = line.split(' ');
        metrics[metricName] = parseFloat(metricValueStr);
      }
    }

    return metrics;
  }
}
