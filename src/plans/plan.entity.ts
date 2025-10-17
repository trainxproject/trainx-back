import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PlansStatus } from "src/plans.enum";



@Entity({
    name: "plans"
})

export class Plan {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string

    @Column()
    type: string

    @Column({type: "numeric", precision:10, scale: 2 , default: 0})
    price: number;

    @Column({type: "varchar", default: "USD"})
    currency: string

    @Column({length: 50})
    features: string

    @Column({
        type: "enum",
        enum: PlansStatus,
        default: PlansStatus.ACTIVE
    })
    status: PlansStatus

}