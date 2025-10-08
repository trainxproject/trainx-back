import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { Subscription } from '../../suscriptions/entities/subscription.entity';
import { v4 as uuidv4 } from 'uuid';
import { Payment } from '../../payments/entities/payment.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

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

    @OneToMany(() => Payment, (payment) => payment.user)
    payments: Payment[];

}