export interface Email {
  id: number;
  email: string;
  subscribed: boolean;
  createdAt: Date;
  deletedAt?: Date;
}
