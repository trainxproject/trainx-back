import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
  ) {}

  // 📋 Obtener todas las suscripciones (con datos del usuario)
  findAll() {
    return this.subscriptionsRepository.find({ relations: ['user'] });
  }

  // ➕ Crear una nueva suscripción
  async create(subscription: Partial<Subscription>) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // vence en un mes

    const newSubscription = this.subscriptionsRepository.create({
      ...subscription,
      startDate,
      endDate,
      isActive: true,
    });

    return this.subscriptionsRepository.save(newSubscription);
  }

  // ❌ Eliminar una suscripción
  remove(id: string) {
    return this.subscriptionsRepository.delete(id);
  }

  // ✅ Verificar si una suscripción está activa o vencida
  async checkSubscriptionStatus(id: string) {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!subscription) {
      return { message: 'Suscripción no encontrada' };
    }

    const today = new Date();

    // Compara la fecha actual con la fecha de fin
    if (today > new Date(subscription.endDate)) {
      subscription.isActive = false;
      await this.subscriptionsRepository.save(subscription);
      return {
        message: 'Subscription expired',
        isActive: false,
        user: subscription.user,
      };
    }

    return {
      message: 'Active subscription',
      isActive: true,
      user: subscription.user,
    };
  }
}