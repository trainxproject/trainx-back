import { Controller, Delete, Get, Post, Put } from "@nestjs/common";
import { PlanService } from "./plan.service";

@Controller()

export class PlanController{

    constructor(private readonly service: PlanService){}
    
    @Get()
    async viewPlan(){
        return await this.service.view()
    }
    
    @Post()
    async createPlan(){
        return await this.service.create()
    }
    
    @Put()
    async modifyPlan(){
        return await this.service.modify()
    }

    @Delete()
    async deletePlan(){
        return await this.service.delete()
    }
}