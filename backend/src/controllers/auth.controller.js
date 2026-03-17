import userModel from "../model/user.model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"


export async function registerUser(req,res){
    const {username,email,password} = req.body

    const isUserALreadyExists = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if(isUserALreadyExists){
        return res.status(409).json({
            message:"user already exists"
        })
    }

    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
        email,username,password:hash
    })
    
    const token = jwt.sign(
        {id:user._id,username:user.username,role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token", token, {
    httpOnly: true,     
    secure: false,     
    sameSite: "lax",    
    maxAge: 24 * 60 * 60 * 1000 
});

    res.status(201).json({
        message:"user registered successfully",
        user:{
            username:user.username,
            id:user._id,
            email:user.email
        }
    })
}


export async function loginUser(req,res){

    const {username,email,password} = req.body

    if(!password || (!email && !username)){
        return res.status(400).json({
            message:"email/username and password required"
        })
    }

    const user = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    }).select("+password")

    if(!user){
        return res.status(401).json({
            message:"invalid credentials"
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(401).json({
            message:"invalid credentials"
        })
    }

    const token = jwt.sign(
        {id:user._id,username:user.username,role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token", token, {
    httpOnly: true,    
    secure: false,    
    sameSite: "lax",   
});

    res.status(200).json({
        message:"user logged in successfully",
        user:{
            username:user.username,
            id:user._id,
            email:user.email
        }
    })
}


export async function getMe(req,res){

    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message:"user fetched successfully",
        user
    })

}


export async function logoutUser(req, res) {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0), 
        sameSite: "lax"
    });
    
    return res.status(200).json({ message: "Logged out successfully" });
}

