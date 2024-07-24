const nodemailer = require('nodemailer');


const otpService = {
    otpMap: new Map(),

    generateOTP: function () {
        return Math.floor(100000 + Math.random() * 900000); 
    },

    sendOTP: async function (email, otp) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'ihsantk786313@gmail.com', 
                    pass: 'rdfz ebfk dwag foab' 
                }
            });

            const mailOptions = {
                from: 'ihsantk786313@gmail.com',
                to: email,
                subject: 'Login OTP',
                text: `Your OTP for login is: ${otp}`
            };

            await transporter.sendMail(mailOptions);
            console.log('OTP sent successfully.');
        } catch (error) {
            console.error('Error sending OTP:', error);
            throw new Error('Error sending OTP. Please try again.');
        }
    },

    verifyOTP: function (email, otp) {
        const storedOTP = this.otpMap.get(email);  
        return storedOTP === otp;
    }
};

module.exports = otpService;