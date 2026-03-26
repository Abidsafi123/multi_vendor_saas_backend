import stripe from "../config/stripe.js";
import orderModel from "../models/order.model.js";
import dotenv from "dotenv";
dotenv.config();

// create stripe api key

export const createStripeKey = async(req,res,next)=>{
    try {
        const{orderId} = req.body
        const order = await orderModel.findById(orderId).populate('orderItems.product')
        if(!order){
            return res.status(404).json({
                success:false,
                message:'Order not found!'
            })
        }
        // convert order items to stripe format

       const line_items = order.orderItems.map((item)=>({
        price_data:{
            currency:'usd',
            product_data:{
                name:item.product.name,
             

            },
            unit_amount:item.product.price*100 // stripe uses cents

        },
        quantity:item.quantity
       }));

       // create stripe session

       const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        line_items:line_items,
        mode:'payment',
        success_url:'https://localhost:5000/success',
        cancel_url:'https://localhost:5000/cancel',
        metadata:{
            orderId:order._id.toString()

        }
       })

    res.status(200).json({
        success:true,
        url:session.url// redirect user here
        
       })
    } catch (error) {
        next(error)
        
    }
}
    

// WEBHOOKS

export const stripeWebhook = async(req,res,next)=>
 {
     const sig = req.headers['stripe-signature'];
     let event;
try {
    event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_API_KEY

    )

    
} catch (error) {
    next(error)
    
}
// handle event

if(event.type==='checkout-session.completed'){
    const session = event.data.object;
    const orderId = session.metadata.orderId;
    const order = await orderModel.findById(orderId)
    if(order){
        order.orderStatus = 'paid'
        await order.save()
}

}

 res.json({
    received:true
})

}