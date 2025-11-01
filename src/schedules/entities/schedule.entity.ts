import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Activity } from '../../activities/entities/activity.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    dayOfWeek: string; 

    @Column()
    startTime: string;

    @Column()
    endTime: string;

    @Column()
    trainer: string;

    @ManyToOne(() => Activity, (activity) => activity.schedules)
    activity: Activity;

    @OneToMany(() => Reservation, (reservation) => reservation.schedule)
    reservations: Reservation[];
}