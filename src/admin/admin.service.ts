import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PaymentsService } from 'src/payments/payments.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly paymentsService: PaymentsService
  ) {}

  async updateUserStatus(id: string, status: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.status = status;
    return await this.usersService.saveStatus(user);
  }

  async getPayments(userId?: string) {
    if (userId) return this.paymentsService.findByUser(userId);
    return this.paymentsService.findAll();
  }
}