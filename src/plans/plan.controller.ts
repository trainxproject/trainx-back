import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Req, UseGuards } from "@nestjs/common";
import { PlanService } from "./plan.service";
import { partialDto, planDto } from "./plan.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("plans")

export class PlanController{

    constructor(private readonly service: PlanService){}
    
    @Get()
    async viewPlan(){
        return await this.service.view()
    }
    
    @UseGuards(AuthGuard("jwt"))
    @Post()
    async createPlan(
        @Body() plan: planDto,
        @Req() req: any
    ){
        const id = req.user.id
        return await this.service.create(plan, id)
    }
    
    @Put(":id")
    async modifyPlan(
        @Param("id", new ParseUUIDPipe()) planId: string,
        @Body() plan: partialDto,
        @Req() req: any
    ){
        const userId = req.user.id
        return await this.service.modify(plan, userId, planId)
    }

    @Delete(":id")
    async deletePlan(
        @Param("id", new ParseUUIDPipe) id: string,
        @Req() req: any
    ){
        const userId = req.user.id
        await this.service.delete(userId, id)
        return {message: "Plan successfully deleted"} 
    }

    @Patch(":id")
    async modifyStatus(
        @Param("id", new ParseUUIDPipe) id: string,
        @Req() req: any
    ){
         const userId = req.user.id
        return await this.service.status(id, userId)
    }
}