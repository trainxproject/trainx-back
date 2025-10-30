import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trainer } from './entities/trainer.entity';

@Injectable()
export class TrainersService {
  constructor(
    @InjectRepository(Trainer)
    private trainersRepository: Repository<Trainer>,
  ) {}

  async findAll() {
    return this.trainersRepository.find();
  }

  async findOne(id: string) {
    return this.trainersRepository.findOne({ where: { id } });
  }

  async create(data: Partial<Trainer>) {
    const trainer = this.trainersRepository.create(data);
    return this.trainersRepository.save(trainer);
  }

  async findByName(name: string) {
    return this.trainersRepository.findOne({ where: { name } });
  }

  async seed() {
    const trainers = [
      {
        name: 'Antonella Miracle',
        specialization: 'Entrenadora olímpica de powerlifting, especializada en técnica y planificación de fuerza, con integración de control mental y conciencia corporal a partir de su maestría en psicología deportiva y formación avanzada en telas aéreas.',
        imageUrl: 'https://res.cloudinary.com/dxpqhpme3/image/upload/v1761433928/antonella-miracle_bbhthd.jpg',
      },
      {
        name: 'Lucas Romero',
        specialization: 'Entrenador especializado en fuerza explosiva, enfocado en mejorar técnica, potencia y rendimiento en competiciones. Experiencia en programas de hipertrofia y resistencia muscular, combinando entrenamiento funcional y planificación de cargas.',
        imageUrl: 'https://res.cloudinary.com/dxpqhpme3/image/upload/v1761433927/lucas-romero_egpv6j.jpg',
      },
      {
        name: 'Sofía Torres',
        specialization: 'Entrenadora especializada en entrenamiento correctivo, movilidad articular y prevención de lesiones en fuerza. Experta en diseño de programas de acondicionamiento funcional, fortalecimiento muscular equilibrado y técnicas de recuperación.',
        imageUrl: 'https://res.cloudinary.com/dxpqhpme3/image/upload/v1761433928/sofia-torres_duljzi.jpg',
      },
      {
        name: 'Uriel Rodríguez',
        specialization: 'Entrenador especializado en desarrollo de hipertrofia y acondicionamiento físico integral. Experto en planificación de rutinas adaptadas a diferentes niveles, combinando técnica y resistencia para mejorar el rendimiento general.',
        imageUrl: 'https://res.cloudinary.com/dxpqhpme3/image/upload/v1761433928/uriel-rodriguez_i1hip2.jpg',
      },
    ];

    for (const trainer of trainers) {
      const exists = await this.findByName(trainer.name);
      if (!exists) {
        await this.create(trainer);
      }
    }

    return { message: 'Trainers seeded successfully ✅' };
  }
}