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

  async getUsersList() {
    const users = await this.usersService.findAllComplete();
  
    return users.map(user => {
      // Obtener el último pago
      const lastPayment = user.payments && user.payments.length > 0
        ? user.payments.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0]
        : null;
  
      // Obtener suscripción activa
      const subscription = user.subscription;
  
      // Obtener reservas activas
      const activeReservations = user.reservations
        ? user.reservations.filter(r => r.status === 'active')
        : [];
  
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        // Estado del usuario (activo/inactivo)
        status: user.status, // Este campo muestra si el usuario está "activo" o "inactivo"
        profilePicture: user.profilePicture,
        
        // Plan mensual (de la suscripción)
        monthlyPlan: subscription ? {
          type: subscription.type,
          amount: subscription.amount,
          isActive: subscription.isActive,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
        } : null,
  
        // Último pago (ordenado por fecha más reciente)
        lastPayment: lastPayment ? {
          id: lastPayment.id,
          amount: lastPayment.amount,
          paid: lastPayment.paid, // true/false si está pagado
          paymentMethod: lastPayment.paymentMethod,
          createdAt: lastPayment.createdAt, // Fecha del último pago
          status: lastPayment.status, // Estado del pago (ACTIVE, CANCELLED)
          planName: lastPayment.plan?.name,
        } : null,
  
        // Entrenador asignado
        trainer: user.trainer ? {
          id: user.trainer.id,
          name: user.trainer.name,
          specialization: user.trainer.specialization,
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
        }
      };
    });
  }
}