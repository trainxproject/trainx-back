import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Activity {
    @PrimaryGeneratedColumn("uuid")
    id: string = uuidv4();

    @Column()
    name: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ default: false })
    requiresReservation: boolean;

    @Column({ nullable: true })
    maxCapacity: number;

    @Column()
    imageUrl: string;

    @OneToMany(() => Schedule, (schedule) => schedule.activity)
    schedules: Schedule[];
}