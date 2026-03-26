import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, No token provided",
      });
    }

    // verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    const user = await userModel
      .findById(decoded.id)
      .select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};


// role based authorization
 
export const roleBasedAuthorization = (...roles)=>{
     return async(req,res,next)=>{
          if(!roles.includes(req.user.role)) {
            return res.status(403).json({
                success:false,
                message:"Access Denied, you don,t have permission to perform this action because of your role!"
            })
        }
        next();
        
      
     }

    
    }