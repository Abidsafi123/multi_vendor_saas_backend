import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }
    // check userExist or not
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists!",
      });
    }

    //generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      username: username,
      email: email,
      password: passwordHash,
      role:role
    });
    await newUser.save();
    res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

// login user

const generateToken = (userId) => {
  return jwt.sign({id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
};
export const loginUser = async (req, res,next) => {
  try {
    const { email, password  } = req.body;
    if (!email || !password) {
      res.status(401).json({
        success: false,
        message: "All fields are required!",
      });
    }
    const user = await userModel.findOne({ email }).select("+password")
    if (!user) {
        return res.status(401).json({
            success:false,
            message:"User does not exist!"
        })
    
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email credentials!",
      });
    }
    const token = generateToken(user.id);
    return res.status(201).json({
      success: true,
      message:` Welcome ${user.username}`,
      token: token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};


 
