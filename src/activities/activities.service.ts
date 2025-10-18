import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivitiesService {
    constructor(
        @InjectRepository(Activity)
        private readonly activityRepository: Repository<Activity>,
    ) {}

    findAll() {
        return this.activityRepository.find({ relations: ['schedules'] });
    }

    findOne(id: string) {
        return this.activityRepository.findOne({
        where: { id },
        relations: ['schedules'],
        });
    }

    findByName(name: string) {
        return this.activityRepository.findOne({ where: { name } });
    }

    create(data: Partial<Activity>) {
        const activity = this.activityRepository.create(data);
        return this.activityRepository.save(activity);
    }
}