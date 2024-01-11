import { Controller, Get, Post, Delete, Body, HttpCode } from '@nestjs/common';
import { SubscriptionService } from '../../services/subscription/subscription.service';

@Controller('emails')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  @HttpCode(200)
  async getAllEmails() {
    const emails = await this.subscriptionService.getAllEmails();
    return {
      emails,
      message: 'All emails fetched successfully',
      success: true,
    };
  }

  @Post('subscribe')
  @HttpCode(200)
  async subscribeEmail(@Body('email') email: string) {
    const message = await this.subscriptionService.subscribeEmail(email);
    return { message, success: true };
  }

  @Delete('unsubscribe')
  @HttpCode(200)
  async unsubscribeEmail(@Body('email') email: string) {
    const message = await this.subscriptionService.unsubscribeEmail(email);
    return { message, success: true };
  }
}
