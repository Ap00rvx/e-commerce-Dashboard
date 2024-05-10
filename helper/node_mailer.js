const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASSWORD,
    authMethod: 'PLAIN'
  },
  
});
const sendMail = async (email,otp,name ) =>  {
  console.log("herere");
  await transporter.sendMail({
    from: '"Shopie Zone" <apoorvbraj@gmail.com>',
    to: email ,
    html :`<p>Hello ${name},</p><p>This is your one-time password: ${otp}</p>`,
    subject : "Verify your Email",
    text : "Hello" + name + "This is your one time password "+ otp , 
  });
  console.log("email sent");
}

module.exports = sendMail; 