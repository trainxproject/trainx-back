import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Subscription } from '../../suscriptions/entities/subscription.entity';
import { Pay } from '../../payments/entities/payment.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { Trainer } from '../../trainers/entities/trainer.entity';
import { TrainerQualification } from 'src/trainers/entities/qualification.entity';

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

    @Column({ default: 'active' })
    status: string;

    @Column({default: false})
    isAdmin: boolean

    @OneToOne(() => Subscription, (subscription) => subscription.user)
    subscription: Subscription;

    @OneToMany(() => Pay, (payment) => payment.user)
    payments: Pay[];

    @OneToMany(() => Reservation, (reservation) => reservation.user)
    reservations: Reservation[];

    @Column({ default: false })
    hasPaid: boolean;

    @ManyToOne(() => Trainer, { nullable: true })
    @JoinColumn({ name: 'trainerId' })
    trainer?: Trainer;

    @OneToMany(()=> TrainerQualification, (e)=> e.user)
    qualifications: TrainerQualification[]

}