import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv .config();
export const transport=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.NODEMAILER_USER,
        pass:process.env.NODEMAILER_PASS
    }
})
export const mailOptions={
    from:'anubmanickam1972@gmail.com',
    to:'gangadharana01@gmail.com',
    subject:'Sending email using node js success',
    text:'that was esay'
};