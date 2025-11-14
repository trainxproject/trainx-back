import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PaymentsService } from 'src/payments/payments.service';
import { SubStatus } from '../pay.enum';

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

  async getUsersList() {
    const users = await this.usersService.findAllComplete();
  
    return users.map(user => {
      // Obtener el último pago
      const lastPayment = user.payments && user.payments.length > 0
        ? user.payments[0] // Ya viene ordenado por createdAt DESC
        : null;
  
      // Determinar si tiene un plan activo basado en el último pago
      const hasActivePlan = lastPayment 
        && lastPayment.paid 
        && lastPayment.status === SubStatus.ACTIVE 
        && new Date(lastPayment.endsAt) > new Date(); // Verifica que no haya expirado
  
      // Obtener reservas activas
      const activeReservations = user.reservations
        ? user.reservations.filter(r => r.status === 'active')
        : [];
  
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        profilePicture: user.profilePicture,
        
        // Plan actual (del último pago si está activo)
        currentPlan: hasActivePlan && lastPayment.plan ? {
          id: lastPayment.plan.id,
          name: lastPayment.plan.name,
          type: lastPayment.plan.type,
          price: lastPayment.plan.price,
          currency: lastPayment.plan.currency,
          features: lastPayment.plan.features,
          status: lastPayment.plan.status,
          isActive: hasActivePlan, // true/false si el plan está activo
          startsAt: lastPayment.startsAt,
          endsAt: lastPayment.endsAt,
          billingCycle: lastPayment.billingCycle, // mensual/anual
        } : null,
  
        // Último pago (información del pago)
        lastPayment: lastPayment ? {
          id: lastPayment.id,
          amount: lastPayment.amount,
          paid: lastPayment.paid,
          paymentMethod: lastPayment.paymentMethod,
          createdAt: lastPayment.createdAt, // ✅ Última fecha de pago
          status: lastPayment.status,
          startsAt: lastPayment.startsAt,
          endsAt: lastPayment.endsAt,
          planName: lastPayment.plan?.name,
        } : null,
  
        // Entrenador asignado ✅
        trainer: user.trainer ? {
          id: user.trainer.id,
          name: user.trainer.name,
          specialization: user.trainer.specialization,
          formation: user.trainer.formation,
          imageUrl: user.trainer.imageUrl,
          qualification: user.trainer.qualification,
          available: user.trainer.available,
        } : null,
  
        // Clases reservadas (solo activas)
        reservedClasses: activeReservations.map(reservation => ({
          id: reservation.id,
          createdAt: reservation.createdAt,
          status: reservation.status,
          schedule: reservation.schedule ? {
            id: reservation.schedule.id,
            dayOfWeek: reservation.schedule.dayOfWeek,
            startTime: reservation.schedule.startTime,
            endTime: reservation.schedule.endTime,
            trainer: reservation.schedule.trainer,
            activity: reservation.schedule.activity ? {
              name: reservation.schedule.activity.name,
              description: reservation.schedule.activity.description,
            } : null,
          } : null,
        })),
  
        // Estadísticas adicionales
        stats: {
          totalPayments: user.payments?.length || 0,
          totalReservations: user.reservations?.length || 0,
          activeReservations: activeReservations.length,
          hasPaid: user.hasPaid,
          hasActivePlan: hasActivePlan, // ✅ Indica si tiene plan activo
        }
      };
    });
  }

  async getMonthlyRevenue() {
    const allUsers = await this.usersService.findAll();
    
    const totalRevenue = allUsers
      .filter(user => user.subscription?.isActive)
      .reduce((sum, user) => {
        return sum + Number(user.subscription.amount);
      }, 0);
  
    return {
      totalMonthlyRevenue: totalRevenue,
      currency: 'ARS',
      activeSubscriptions: allUsers.filter(u => u.subscription?.isActive).length
    };
  }
  
   async getPlansCountByType(planType: 'week-3' | 'week-5') {
    const allUsers = await this.usersService.findAll();

    if(!allUsers) throw new ForbiddenException("Usuario")
    
    const count = allUsers.reduce((acc, allUsers) => {
      const plan = allUsers.payment.filter(e=> e.plan === planType).length || 0;
      return acc + plan;
    }, 0)
  
    return {
      planType,
      count,
      description: planType === 'week-3' ? '3 días a la semana' : '5 días a la semana'
    };
  }

  async activateUser(id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    user.status = 'active';
    return await this.usersService.saveStatus(user);
  }
  
  async deactivateUser(id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    user.status = 'inactive';
    return await this.usersService.saveStatus(user);
  }
}