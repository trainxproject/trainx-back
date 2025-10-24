import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { Subscription } from '../../suscriptions/entities/subscription.entity';
import { Pay } from '../../payments/entities/payment.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity({
    name: "users"
})

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

    @Column({default: false})
    isAdmin: false

    @OneToOne(() => Subscription, (subscription) => subscription.user)
    subscription: Subscription;

    @OneToMany(() => Pay, (payment) => payment.user)
    payments: Pay[];

    @OneToMany(() => Reservation, (reservation) => reservation.user)
    reservations: Reservation[];

}