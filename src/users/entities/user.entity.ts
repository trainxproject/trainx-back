import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Subscription } from '../../suscriptions/entities/subscription.entity';
import { v4 as uuidv4 } from 'uuid';
import { Payment } from '../../payments/entities/payment.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { Trainer } from '../../trainers/entities/trainer.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string = uuidv4();

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    profilePicture: string;

    @Column({ default: 'activo' })
    status: string;

    @OneToOne(() => Subscription, (subscription) => subscription.user)
    subscription: Subscription;

    @OneToMany(() => Reservation, (reservation) => reservation.user)
    reservations: Reservation[];

    @OneToMany(() => Payment, (payment) => payment.user)
    payments: Payment[];

    @Column({ default: false })
    hasPaid: boolean;

    @ManyToOne(() => Trainer, { nullable: true })
    @JoinColumn({ name: 'trainerId' })
    trainer?: Trainer;
}