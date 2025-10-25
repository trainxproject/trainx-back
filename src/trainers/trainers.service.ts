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
        name: 'Lucas Romero',
        specialization: 'Entrenamiento de fuerza explosiva y levantamiento olímpico',
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1726000000/lucas_romero.jpg',
      },
      {
        name: 'Carla Gómez',
        specialization: 'Desarrollo integral de fuerza, técnica y resistencia muscular',
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1726000000/carla_gomez.jpg',
      },
      {
        name: 'Martín Rodríguez',
        specialization: 'Programación de fuerza periodizada y aumento de rendimiento competitivo',
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1726000000/martin_rodriguez.jpg',
      },
      {
        name: 'Sofía Torres',
        specialization: 'Entrenamiento correctivo, movilidad articular y prevención de lesiones en fuerza',
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1726000000/sofia_torres.jpg',
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