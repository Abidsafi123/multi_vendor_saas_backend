import express from "express"
import { authMiddleware,roleBasedAuthorization } from "../middleware/auth.middleware.js"

const router = express.Router()


router.get('/profile',authMiddleware,(req,res)=>{
    return res.status(200).json({
        success:true,
        message:"Profile accssed successfully",
        user:req.user // login user
    })
})
router.get('/admin',authMiddleware,roleBasedAuthorization('admin'),(req,res)=>{
    return res.status(200).json({
        success:true,
        message:"Admin accessed successfully",
       
    })
})

router.get("/vendor",authMiddleware,roleBasedAuthorization('vendor'),(req,res)=>{
    return res.status(200).json({
        success:true,
        message:"Welcome vendor "
    })
})


export default router