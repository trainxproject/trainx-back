import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Plan } from "./plan.entity";
import { partialDto, planDto } from "./plan.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PlansStatus } from "src/plans.enum";
import { User } from "src/users/entities/user.entity";





@Injectable()


export class PlanService {
    
    constructor(
        @InjectRepository(Plan)
        private readonly planRepo: Repository<Plan>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ){}

    async view(){
        return await this.planRepo.find()
    }

    async create(dto: planDto, id: string){
        const admin = await this.userRepo.findOne({where: {id: id}})
        if(admin?.isAdmin === false) throw new BadRequestException("Sorry, you don't have the necessary permissions.")

        const createPlan = this.planRepo.create({
                ...dto,
                status: PlansStatus.ACTIVE
            })
        
        return await this.planRepo.save(createPlan);

    }
    async modify(plan: partialDto, userId: string, planId: string){
        const admin = await this.userRepo.findOne({where: {id: userId}})
        if(admin?.isAdmin === false) throw new BadRequestException("Sorry, you don't have the necessary permissions.")

        const searchPlan = await this.planRepo.findOne({where: {id: planId}})
        if(!searchPlan) throw new NotFoundException("Plan not found.")

        const modify = await this.planRepo.merge(searchPlan, plan)

        return await this.planRepo.save(modify);
    }


    async delete(userId: any, id: string){
        const admin = await this.userRepo.findOne({where: {id: userId}})
        if(admin?.isAdmin === false) throw new BadRequestException("Sorry, you don't have the necessary permissions.")

        const searchPlan = await this.planRepo.findOne({where: {id: id}})
        if(!searchPlan) throw new NotFoundException("Plan not found.")
        
        return await this.planRepo.delete(id); 
    }

    async status(id: string, userId:string){
        const admin = await this.userRepo.findOne({where: {id: userId}})
        if(admin?.isAdmin === false) throw new BadRequestException("Sorry, you don't have the necessary permissions.")

        const searchPlan = await this.planRepo.findOne({where: {id: id}})
        if(!searchPlan) throw new NotFoundException("Plan not found.")

        const newStatus = searchPlan.status === PlansStatus.ACTIVE ? PlansStatus.SUSPENDED : PlansStatus.ACTIVE

        await this.planRepo.update({id: searchPlan.id}, {status: newStatus})
        
        return await this.planRepo.findOne({where: {id: id}})
    }


}