import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  findAll(): Promise<Payment[]> {
    return this.paymentsRepository.find({ relations: ['user'] });
  }

  findByUser(userId: string): Promise<Payment[]> {
    return this.paymentsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async create(paymentData: Partial<Payment>): Promise<Payment> {
    const payment = this.paymentsRepository.create(paymentData);
    return this.paymentsRepository.save(payment);
  }

  async markAsPaid(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({ where: { id } });
    if (!payment) throw new Error('Pago no encontrado');
    payment.paid = true;
    return this.paymentsRepository.save(payment);
  }
}
