import express from "express"
import {authMiddleware,roleBasedAuthorization} from "../middleware/auth.middleware.js"
import { createStore,approvedStore } from "../controllers/store.controller.js"

const router = express.Router()

router.post('/create',authMiddleware,roleBasedAuthorization("vendor"),createStore)
router.post('/approve/:id',authMiddleware,roleBasedAuthorization('admin'),approvedStore)
router.put('/update/:id',authMiddleware,roleBasedAuthorization('admin'),approvedStore)
export default router