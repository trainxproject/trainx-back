import { Body, Controller, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MercadoPagoConfig, Payment, PreApproval, Preference } from 'mercadopago';
import { PlansEnum} from "src/pay.enum";
import { Pay } from "src/payments/entities/payment.entity";
import { addDays } from "src/utils/date.util";
import { mapStatus } from "src/utils/status.util";
import { Repository } from "typeorm";

@Injectable()


export class MpService {
   
    

    private readonly client: MercadoPagoConfig 

    constructor(
        @InjectRepository(Pay)
        private readonly paymentRepo: Repository<Pay>,
    ){
        this.client =  
        new  MercadoPagoConfig({accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string}) 
    }

    async CreatePreference(paymentData: any) {

        try {
             console.log('📩 Body recibido:', paymentData);
       const preference = new Preference(this.client)
        
        const result = await preference.create({
            body: {
                items:[
                    {
                    id: paymentData.id.substring(0, 256), 
                    title: paymentData.title.substring(0, 256),
                    quantity: Number(paymentData.quantity) || 1,
                    unit_price: Number(paymentData.price),
                    currency_id: paymentData.currency || "ARS" 
                }
                ],
                back_urls: {
                    success: 'https://attractive-saponaceous-cleo.ngrok-free.dev/mp/success',
                    failure: 'https://attractive-saponaceous-cleo.ngrok-free.dev/mp/failure',
                    pending: 'https://attractive-saponaceous-cleo.ngrok-free.dev/mp/pending',
                },
                notification_url: `${process.env.WEBHOOK_URL}?token=${process.env.WEBHOOK_TOKEN}`,
                external_reference: paymentData.external_reference
            }
        })
         return result

            
        } catch (error: any) {
    
        console.error('❌ Error creando preferencia MP:', error);
        throw new Error(`No se pudo crear el pago: ${error.message}`);
    }



       
    }

    async processPayment(id: string) {

        const myPayment = new Payment(this.client)
        const pay = await myPayment.get({id: id})

        console.log('📦 Pago verificado:', pay);

         if(!pay.id) throw new NotFoundException("Not found")

        const existingPayment = await this.paymentRepo.findOne({
            where: {MpPaymentId: String(pay.id)}
        })

        if(!existingPayment){
        
            const newPayment = this.paymentRepo.create({
                MpPaymentId: String(pay.id),
                amount: pay.transaction_amount,
                status: mapStatus(pay.status as string),
                paymentMethod: pay.payment_type_id,
                externalReference: pay.external_reference,
                startsAt: new Date(),
                endsAt: addDays(new Date(), 30),
                isSubscription: false,
            })

            await this.paymentRepo.save(newPayment)
            console.log('💾 Nuevo pago guardado:', newPayment);
        } else {
            existingPayment.status = mapStatus(pay.status as string)
            existingPayment.amount = pay.transaction_amount as number,
            existingPayment.paymentMethod = pay.payment_type_id as string,

            await this.paymentRepo.save(existingPayment)
            console.log('🔁 Pago actualizado:', existingPayment);
        }
    }

    async processSubscription(id: any) {
            
            const approval = new PreApproval(this.client)
            const subs = await approval.get({id: id})

            console.log('🔁 Subscripción verificada:', subs);

            if(!subs.id) throw new NotFoundException("Subscription not found")

            const existingSubs = await this.paymentRepo.findOne({
                where: {externalReference: subs.external_reference}
            })

            if(!existingSubs){
            
            const freqType = subs.auto_recurring?.frequency_type; 
            let billingCycle: PlansEnum | undefined;

            if(freqType === "week-3") billingCycle = PlansEnum.WEEK3;
            else if(freqType === "week-5") billingCycle = PlansEnum.WEEK5 
            else billingCycle = undefined

            let endsAt: Date;

            if(billingCycle === PlansEnum.WEEK3) endsAt = addDays(new Date(), 21 - 3)
            else if(billingCycle === PlansEnum.WEEK5) endsAt = addDays(new Date(), 35 - 5) 
            else endsAt = addDays(new Date(), 30) 

            let renewalDueAt = addDays(endsAt, -3)

            const newSub = this.paymentRepo.create({
                    MpPaymentId: String(subs.id),
                    externalReference: subs.external_reference,
                    amount: subs.auto_recurring?.transaction_amount,
                    status: mapStatus(subs.status as string),
                    billingCycle,
                    startsAt: new Date(subs.date_created as string),
                    isSubscription: true,
                    endsAt,
                    renewalDueAt,
                });

                await this.paymentRepo.save(newSub);
                console.log('💾 Nueva suscripción guardada:', newSub);
            } else {
                existingSubs.status = mapStatus(subs.status as string);
                await this.paymentRepo.save(existingSubs);
                console.log('🔁 Suscripción actualizada:', existingSubs);
            }
        
    }
    



}