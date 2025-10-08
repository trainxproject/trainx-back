import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':userId')
  findByUser(@Param('userId') userId: string) {
    return this.paymentsService.findByUser(userId);
  }

  @Post()
  create(@Body() body: any) {
    return this.paymentsService.create(body);
  }

  @Patch(':id/pay')
  markAsPaid(@Param('id') id: string) {
    return this.paymentsService.markAsPaid(id);
  }
}