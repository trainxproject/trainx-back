import { Body, Controller, Get, Post, Query, Req, UseGuards} from "@nestjs/common";
import { MpService } from "./mercado.service";
import { AuthGuard } from "@nestjs/passport";


@Controller("mp")


export class MpController {

    constructor(private readonly service: MpService){}
    
    @Post('preference')
    @UseGuards(AuthGuard("jwt"))
    async preferencePay (
        @Body() paymentData: any,
        @Req() req
    ){
        const id = req.user.id
        const preference = await this.service.CreatePreference(paymentData, id)
        return {
            init_point: preference.init_point,
            external_reference: preference.external_reference
        }}


    
    
    @Post("webhook")
    async notification(@Body() body: any, @Query() query: any){
            console.log('🔔 Webhook recibido:', body, query);

            const topic =
                query.topic ||
                body.topic ||
                body.type || 
                body.action?.split('.')[0]; 

            const id =
                query.id ||
                body.id ||
                body.data?.id ||
                (body.resource ? body.resource.split('/').pop() : null);

            if(topic === "merchant_order" && id){
                await this.service.processMerchant(id);
            } else if(topic === "payment" && id){
                await this.service.processPayment(id);
            } else{
                console.log('⚠️ Tipo de notificación no manejada:', topic);
            }

            
            return{received: true, topic, id}
        
    }
    
    
    
    @Get('success')
    handleSuccess(@Query() query: any) {
        return { message: 'Pago aprobado ✅', data: query };
    }

    @Get('failure')
    handleFailure(@Query() query: any) {
        return { message: 'Pago rechazado ❌', data: query };
    }

    @Get('pending')
    handlePending(@Query() query: any) {
        return { message: 'Pago pendiente ⏳', data: query };
    }


}