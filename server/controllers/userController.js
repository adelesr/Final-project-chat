
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { isPasswordCorrect, validateMailAddress } from "./validatorController.js";



export const signUp = async (req,res,next) => {
    try{
        const {userName,password,email,isFemale} = req.body;
        if (!userName||!password||!email)
        {
            //next({status: 400, message: "Username, password and phone number are required"})
            return res.status(400).send("Username, password and phone number are required");
        }
        const user = await User.findOne({userName});
        if(user) 
        {
            return res.status(400).send("User is already exists,go to log in page");
        }
        else {
            if (!isPasswordCorrect(password)) 
            {
                return res.status(400).send("Password must be at least 8 characters long, contain at least one letter, one special character, and at least one number");
            }

            if(!validateMailAddress(email))
            {
                return res.status(400).send("Invalid email please try again! \n notice that email must be in format of  example@example.com");
            }   
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({userName:userName, password: hashedPassword,email: email,isFemale: isFemale});
            res.status(200).send("signed up successfully, go to login page");
        }
    } catch (err) {
        res.status(500).send("error");
    }
}
export const LogIn = async (req,res) => {
    try {
        const { userName, password } = req.body;
        if (!userName ||!password)
        {
             return res.status(400).send("Username and password are required");
        }
           
        if (!isPasswordCorrect(password))
        {
            return res.status(400).send("Password must be at least 8 characters long, contain at least one letter, at least one number, and one special character");
        }
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).send( "The user was not found, please try again or go to sign up page");
        }
        else{
            const samePassword = await bcrypt.compare(password, user.password);
            if(!samePassword) 
            {
                return res.status(404).send("The password or the user name are not correct, please sign in or try again");
            }
            const token= jwt.sign({userName: userName}, process.env.SECRET_KEY, { expiresIn: '24h',issuer: 'http://localhost:8080'});
            res.cookie('jwt', token, {httpOnly: true, maxAge: 90000});
            const newUser={id:(user._id).toString(),userName:user.userName,email:user.email,isFemale:user.isFemale};
            return res.send(newUser);
        }
    }catch(err) {
       return res.status(500).send("error");
    }

}

export const verifyToken = async(req,res,next) => {
    const token = req.cookies.jwt; //שליפה של הטוקן ממאגר הקוקיז
    if(!token) 
        return res.json({message: 'Invalid token', status: false});
    try{
        const isVerify=jwt.verify(token, process.env.SECRET_KEY,{issuer: 'http://localhost:8080'})
        if(!isVerify) 
            {return res.status(403).json({message: 'Invalid token', status: false})}
        else{
            next();
            return res.status(200).json({message:'valid token', status: true,token: token});
        }
    }
    catch(err){
        return res.send({message: 'Invalid token', status: false});
    }
}
    

