
import nodemailer from 'nodemailer';
import bodyParser from "body-parser";
import { validateMailAddress } from "./validatorController.js";
import dotenv from 'dotenv';
import User from '../models/User.js';
dotenv.config();

let verificationCodes = {email:'',code:''};

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_HOST,
        pass: process.env.EMAIL_PASSWORD
    }})
export const sendCodeToMail= async(req,res)=>{
    const {email} = req.body;
    if(!email)
    {
        return res.status(400).send("Email is required");
    }

    if(!validateMailAddress(email))
        return res.status(400).send("Invalid email, notice that email must be in format of  example@example.com");

    const findUserByMail = await User.findOne({email});
    if(!findUserByMail)
        return res.status(400).send("User with this email does not exist, please sign up first");

    const fourDigitCode = Math.floor(1000 + Math.random() * 9000);
    verificationCodes[email] = { code: fourDigitCode, expiresAt: Date.now() + 10 * 60 * 1000 };
    console.log("the verificationCodes[email]",verificationCodes[email]);
    const mailOptions = {
        from:process.env.EMAIL_HOST,
        to: email,
        subject: 'PlayWithAs Verification Code:',
        text: `Your verification code is: ${fourDigitCode}`
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
        } else {
          res.status(200).send("Verification code sent to your email");
        }
      });
}
export const checkVerifyCode = async (req,res) => {
    const {email, code} = req.body;

    if(code== null || code === ''  || code.length !=4 || isNaN(code)  || code.toString().indexOf('.') > -1)
    {
        console.log("No verification code provided, its null");
        return res.status(400).json({
            msg: "Please enter the verification code you received,\nnoticed that it must be 4 digits long and should not contain any special characters",
            user:null
        })
    }

    const storedCode = verificationCodes[email];
    if(!storedCode)
    {
        return res.status(400).json({msg:"Verification code not found, please send the correct email or go to sign up page",
            user:null
        });
    }
    if(Date.now() > storedCode.expiresAt) //אם נמצאה כתובת מייל כזו בדיקשנרי אך תוקף השמירה של הקוד עבר- נמחק אותה
    {
        delete verificationCodes[email];
        return res.status(400).json({msg:"Verification code has expired, please try again",
            user:null
        });
    }
    if(code == storedCode.code) //אם תוקף הקוד עדיין נשמר במערכת 
    {
        const currentUser=await User.findOne({email});
        const userObject = currentUser ? currentUser.toObject() : null;
        delete verificationCodes[email];
        return res.status(200).json({msg:"Verification code is correct",
            user:userObject
        });
    }
     res.status(400).json({msg:"Verification code is incorrect, please try again or resend the verification code",
        user:null
     });
}