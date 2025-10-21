import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pay } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Pay)
    private paymentsRepository: Repository<Pay>,
  ) {}

  findAll(): Promise<Pay[]> {
    return this.paymentsRepository.find({ relations: ['user'] });
  }

  findByUser(userId: string): Promise<Pay[]> {
    return this.paymentsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async create(paymentData: Partial<Pay>): Promise<Pay> {
    const payment = this.paymentsRepository.create(paymentData);
    return this.paymentsRepository.save(payment);
  }

  // async markAsPaid(id: string): Promise<Pay> {
  //   const payment = await this.paymentsRepository.findOne({ where: { id } });
  //   if (!payment) throw new Error('Pago no encontrado');
  //   payment.plan = true;
  //   return this.paymentsRepository.save(payment);
  // }
}
