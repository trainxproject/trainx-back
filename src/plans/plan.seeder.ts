import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Plan } from "./plan.entity";
import { Plans } from "./seeder.plan";



@Injectable()

export class PlanSeeder {
    constructor(private readonly dataSource: DataSource){}
    async run(){
        const repo = await this.dataSource.getRepository(Plan)
        for(const data of Plans){
            const exist = await repo.findOne({where: {name: data.name}})
    
            if(!exist){
                await repo.save(repo.create({
                    ...data,
                    type: data.type as 'week-3' | 'week-5'
                }))
            }
        }
        console.log("✅ All plans seeded")
    }
}






