import { Body, Controller, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MercadoPagoConfig, Payment, PreApproval, Preference, MerchantOrder} from 'mercadopago';
import { PlansEnum} from "src/pay.enum";
import { Pay } from "src/payments/entities/payment.entity";
import { Plan } from "src/plans/plan.entity";
import { User } from "src/users/entities/user.entity";
import { addDays } from "src/utils/date.util";
import { mapStatus } from "src/utils/status.util";
import { DeepPartial, Repository } from "typeorm";


@Injectable()


export class MpService {
   
    

    private readonly client: MercadoPagoConfig 

    constructor(
        @InjectRepository(Pay)
        private readonly paymentRepo: Repository<Pay>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Plan)
        private readonly planRepo: Repository<Plan>
    ){
        this.client =  
        new  MercadoPagoConfig({accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string}) 
    }

    async CreatePreference(paymentData: any, id:string, idPlan: string) {

        try {
            console.log('📩 Body recibido:', paymentData);
            const preference = new Preference(this.client)

            const user = await this.userRepo.findOne({
                where: {id: id}
            })

            const plan = await this.planRepo.findOne({
                where: {id: idPlan}
            })

        
        const result = await preference.create({
            body: {
                items:[
                    {
                    id: String(plan?.id), 
                    title: String(plan?.name),
                    quantity: Number(paymentData.quantity) || 1,
                    unit_price: Number(plan?.price),
                    currency_id: plan?.currency,
                    description: plan?.type
                }
            ],
                back_urls: {
                    success: 'https://attractive-saponaceous-cleo.ngrok-free.dev/mp/success',
                    failure: 'https://attractive-saponaceous-cleo.ngrok-free.dev/mp/failure',
                    pending: 'https://attractive-saponaceous-cleo.ngrok-free.dev/mp/pending',
                },
                notification_url: `${process.env.WEBHOOK_URL}?token=${process.env.WEBHOOK_TOKEN}`,
                external_reference: user?.id
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
        const payResponse = await myPayment.get({id: id})
        const pay = payResponse; 

        // if (!pay?.id) throw new NotFoundException('Payment not found');
        console.log('📦 Pago verificado:', pay);

        const existingPayment = await this.paymentRepo.findOne({
            where: {MpPaymentId: String(pay.id)}
        })

        const plan = pay.additional_info?.items?.[0].id
        const user = pay.external_reference

        if(!existingPayment){
        
            const newPayment: DeepPartial<Pay> = ({
                MpPaymentId: String(pay.id),
                amount: pay.transaction_amount,
                status: mapStatus(pay.status as string),
                paid: true,
                billingCycle: pay.additional_info?.items?.[0].description as PlansEnum,
                paymentMethod: pay.payment_type_id,
                externalReference: pay.external_reference,
                startsAt: new Date(),
                endsAt: addDays(new Date(), 30),
                isSubscription: false,
                user: {id: user} as User,
                plan: {id: plan} as Plan,
            })
            const newOrder = this.paymentRepo.create(newPayment)

            await this.paymentRepo.save(newOrder)
            console.log('💾 Nuevo pago guardado:', newOrder);
        } else {

            if (!existingPayment?.id) {
                throw new NotFoundException("Payment existente sin ID válido — no se puede actualizar");
            }

            const updatedFields = {
                status: mapStatus(pay.status as string),
                amount:  pay.transaction_amount as number,
                paymentMethod: pay.payment_type_id as string
                
            }

            await this.paymentRepo.update(existingPayment.id, updatedFields)

            console.log('🔁 Pago actualizado:', {
                id: existingPayment.id,
                ...updatedFields
        });
        }
    }

    async processMerchant(id: any) {
            
            const approval = new MerchantOrder(this.client)
            const order = await approval.get({merchantOrderId: id})

              console.log('🛒 Merchant Order verificada:', order);

            // if(!order.id) throw new NotFoundException("Subscription not found")

            // const PaymentId =  order.payments?.[0].id;
            // const externalReference = order.external_reference;
            // const status =  order.order_status;
            // const totalAmount = order.total_amount;


            // const existingOrder = await this.paymentRepo.findOne({
            //     where: {MpPaymentId: String(order.id)}
            // })
            
            // const plan = order.items?.[0].id
            // const user = order.external_reference
           
            // if(!existingOrder){
            //     const paymentData: DeepPartial<Pay> = ({
            //     MpPaymentId: String(order.id),
            //     externalReference: externalReference,
            //     amount: totalAmount,
            //     status: mapStatus(String(status)), 
            //     billingCycle: undefined, 
            //     startsAt:order.date_created ? new Date(order.date_created) : new Date(),
            //     isSubscription: false,
            //     endsAt: addDays(order.order_status ? new Date(String(order.date_created)) : new Date(), 30),
            //     user: {id: user} as User,
            //     plan: {id: plan} as Plan
            //     })

            //     const newOrder = this.paymentRepo.create(paymentData)

            //     await this.paymentRepo.save(newOrder)
            //     console.log('💾 Nueva merchant order guardada:', newOrder);
            // } else {
            //     existingOrder.status = mapStatus(String(status))
            //     await this.paymentRepo.update(existingOrder.id, {
            //         status: mapStatus(String(status)),
            //         amount: totalAmount,
            //     });
            //     console.log('🔁 Merchant order actualizada:', existingOrder);
            // }


        
        
    }
    



}