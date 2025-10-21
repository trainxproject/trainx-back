import { Body, Controller, Get, Post, Query} from "@nestjs/common";
import { MpService } from "./mercado.service";


@Controller("mp")


export class MpController {

    constructor(private readonly service: MpService){}
    
    @Post('preference')
    async preferencePay (
        @Body() paymentData: any
    ){
        const preference = await this.service.CreatePreference(paymentData)
        return {
            init_point: preference.init_point,
            external_reference: preference.external_reference
        }}


    
    
    @Post("webhook")
    async notification(@Body() body: any, @Query() query: any){
            console.log('🔔 Webhook recibido:', body, query);

           

              const topic = body.topic;
            const id = body.data?.id || body.id;

            if(topic === "subscription_preapproval" && id){
                await this.service.processSubscription(id);
            } else if(topic === "payment" && id){
                await this.service.processPayment(id);
            } else {
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