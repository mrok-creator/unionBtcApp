import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Counter, Gauge, register } from 'prom-client';

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

  // Method to retrieve all Prometheus metrics
  async getPrometheusMetrics(): Promise<string> {
    await this.savePrometheusMetrics();
    return register.metrics();
  }

  // Method to send collected metrics to Prometheus
  async savePrometheusMetrics(): Promise<void> {
    const metrics = register.metrics();
    await axios.post('http://localhost:8090/metrics/', metrics);
  }
}
