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

  async getStatistics() {
    // Total de usuarios
    const allUsers = await this.usersService.findAll();
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter(u => u.status === 'activo').length;
  
    // Total de pagos
    const allPayments = await this.paymentsService.findAll();
    const totalPayments = allPayments.length;
  
    // Pagos por usuario
    const paymentsByUser: Record<string, number> = {};
    allPayments.forEach(p => {
      paymentsByUser[p.user.id] = (paymentsByUser[p.user.id] || 0) + Number(p.amount);
    });
    
    return {
      totalUsers,
      activeUsers,
      totalPayments,
      paymentsByUser
    };
  }
}