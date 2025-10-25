import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Subscription } from '../../suscriptions/entities/subscription.entity';

@Entity()
export class Trainer {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @Column()
    name: string;

    @Column()
    specialization: string;

    @Column({ nullable: true })
    imageUrl?: string;

    @Column({ default: true })
    available: boolean;
}
