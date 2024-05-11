const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config()
const transporter = nodemailer.createTransport({
  // host: "smtp.gmail.com",

  // port: 587,
  // secure: false,
  service:"gmail" ,// Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASSWORD,
  },
});
const sendMail = async (email,otp, name) =>  {
  await transporter.sendMail({
    from: '"ShopieZone" <secureboot08@gmail.com>',
    to: email ,
    subject : "Verification OTP",
    // html :`<p>Hello ${name},</p><p>This is your one-time password: ${otp}</p>`,
    text : "Hello "+name+" ,\nWelcome to ShopieZone, This is your one time password "+otp ,
    
  });
  console.log("email sent");
}

module.exports = sendMail; 