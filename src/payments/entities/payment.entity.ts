import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE' })
    user: User;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @CreateDateColumn()
    paymentDate: Date;

    @Column({ type: 'date' })
    dueDate: Date;

    @Column({ default: false })
    paid: boolean;
}