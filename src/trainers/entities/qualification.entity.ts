import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Trainer } from "./trainer.entity";


@Entity()

export class TrainerQualification {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.qualifications)
    user: User;

    @ManyToOne(() => Trainer, (trainer) => trainer.qualifications)
    trainer: Trainer;

    @Column({default: 0})
    rating: number;
}
