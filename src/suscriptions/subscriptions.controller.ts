import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './entities/subscription.entity';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @Post()
  create(@Body() subscription: Partial<Subscription>) {
    return this.subscriptionsService.create(subscription);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionsService.remove(id);
  }

  @Get(':id/status')
  checkStatus(@Param('id') id: string) {
    return this.subscriptionsService.checkSubscriptionStatus(id);
  }
}