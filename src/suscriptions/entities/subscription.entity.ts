import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Subscription {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 10000.00 })
    amount: number;

    @OneToOne(() => User, (user) => user.subscription, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;
}