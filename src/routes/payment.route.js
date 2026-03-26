import express from "express"
import { createStripeKey,stripeWebhook } from "../controllers/payment.controller.js"
import {authMiddleware} from "../middleware/auth.middleware.js"
const router = express.Router()

router.post('/checkout',authMiddleware,createStripeKey)
router.post('/webhook',express.raw({type:'application/json'}),stripeWebhook)
export default router