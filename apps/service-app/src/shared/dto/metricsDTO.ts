export class MetricsDTO {
  email: string;
  status: 'subscribed' | 'unsubscribed';
  createdAt: Date;
  deletedAt?: Date;
}
