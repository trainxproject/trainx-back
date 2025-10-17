import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn("uuid")
    id: string = uuidv4();

    @ManyToOne(() => User, (user) => user.reservations)
    user: User;

    @ManyToOne(() => Schedule, (schedule) => schedule.reservations)
    schedule: Schedule;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ default: 'active' })
    status: 'active' | 'cancelled';
}