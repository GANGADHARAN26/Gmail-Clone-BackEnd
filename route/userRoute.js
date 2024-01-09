import express from 'express';
import { userModel } from '../db-utils/mongoose.model.js';
import bcrypt from 'bcrypt';
import  jwt  from 'jsonwebtoken';
import { transport,mailOptions } from '../mail-service/mail.js';
const userRouter=express.Router();
//post method to create the new user with hashed password
userRouter.post('/register',async function(req, res){
    try{
     const payload=req.body;
     //checking the user doest already exists
     const checkUser= await userModel.findOne({email:payload.email},{name:1})
     if(checkUser){
        res.status(400).send({message:"User already exists"})
        return;
     }
     bcrypt.hash(payload.password,10,async function(err,hash){
        if(err){
            res.status(500).send({message:"Error occured while hashing password"})
        }
        const user= await userModel({name:payload.name,email:payload.email,password:hash});
        await user.save();
        const token=jwt.sign({email:payload.email},process.env.JWT_SECRET,{expiresIn:'1d'})
        const link=`${process.env.FRONTEND_URL}/userverification?token=${token}`;
        await transport.sendMail(
            {...mailOptions,
                subject:"Account verification link",
                to:payload.email,
                text:`Please Verify your account 
        by clicking the  link ${link}`}).then(()=>console.log("email has been to your email"))
        console.log('user saved')
        res.send(user)  
     })
    
    }catch(err)
    {
        console.log(err.message);
    }
})
//post method for login if only verified email
userRouter.post('/login',async function(req,res){
    try{
        const payload=req.body;
        const findUser= await userModel.findOne(
            {
                email:payload.email},
                {password:1,isVerified:1,name:1,email:1,_id:0});
        if(findUser){
            bcrypt.compare(payload.password,findUser.password,(_err,result)=>{
                if(!result){
                    res.status(401).send({message:"Invalid credentials"})
                    return ;
                }
                else{
                         if(findUser.isVerified===false){
                            res.status(402).send({message:"User is not Verified"}) 
                            return ;
                         }
                         else{ 
                            const responseObj=findUser.toObject();
                            delete responseObj.password;
                            const accessToken=jwt.sign({accessToken:payload.email},process.env.JWT_SECRET)
                            res.send({...responseObj,accessToken});
                         }
                }
            })
        }
        else{
            res.status(404).send({message:"user not found try again"}) 

        }


    }catch(err){console.log(err.message)}
})
//verification method to activate user details by jwt token
userRouter.post('/verify',async (req, res) =>{
    const payload=req.body;
    try{
        jwt.verify(payload.token,process.env.JWT_SECRET,async(err,result) =>{
            if(result){
                await userModel.updateOne({email:result.email},{'$set':{isVerified:true}})
                res.send({message:"User Verified"})
            }
            else{
                res.status(500).send({message:"verification failed try again"})
            }
        });
    }catch(error){console.log(error.message)} 
})
// forgot password
userRouter.post('/forgotPassword',async(req,res)=>{
    const payload=req.body;
    const user=await userModel.findOne({email:payload.email},{email:1,name:1});

    try{
        if(user){
            const token=jwt.sign({email:user.email},process.env.JWT_SECRET,{expiresIn:'1d'});
            const link=`${process.env.FRONTEND_URL}/verifyForgotPassword?token=${token}`;
            await transport.sendMail({...mailOptions,
                subject:"Forgot Password verification link",
                to:payload.email,
                text:`Request from the username called ${user.name} Please verify your e-mail
                 address to change the password using these link ${link} `})
            res.send({message:" email has been send successfully to emial for password reset verification link"})
        }
        else{
            res.status(401).send({message:"invalid credentials"})  
        }
       
    }catch(error){console.log(error.message)}
})
//contact
userRouter.post('/contact',async(req,res)=>{
    const payload=req.body;
    try{
            await transport.sendMail({...mailOptions,
                subject:payload.subject,
                text:payload.message})
            res.send({message:" Email has been send successfully "})
        }
    catch(error){console.log(error.message)}
})
//verification for the password password
userRouter.post('/passwordVerify', async(req, res)=>{
    try{ 
        const token = req.body.token;
        jwt.verify(token,process.env.JWT_SECRET,async(err,result)=>{
           console.log(result,err)
            await userModel.updateOne({email:result.email},{'$set':{ allowPasswordChange:true}})
            res.send({msg:"user verifed for password reset"})
        });
       
    }
   catch{
    res.status(500).send({msg:"verfication failed"}) 
   }  
})
//updating password
userRouter.post('/updatePassword',async (req,res)=>{
    try{
        const payload=req.body;
        console.log(payload)
        const decodedtoken=jwt.verify(payload.token,process.env.JWT_SECRET)
        const hashedPassword=await bcrypt.hash(payload.password,10)
        console.log(decodedtoken.email,hashedPassword,payload.password)
        const verified=await userModel.findOne({email:decodedtoken.email},{allowPasswordChange:1})
        console.log("verified"+verified)
        if(verified.allowPasswordChange===true){
            await userModel.updateOne({email:decodedtoken.email},{'$set':{password:hashedPassword,allowPasswordChange:false}});
            res.send({msg:"updated password"})
        }
        else{
            res.status(401).send({msg:"still password reset validation is not done"})
        }
       
        
    
    }catch{
        res.status(500).send({msg:"passwords updation failed"})  
    }
})
export default userRouter