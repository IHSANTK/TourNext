const Razorpay = require("razorpay");
require("dotenv").config();

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});


const generateRazorpay = (pkgId, total) => {
    try {
        return new Promise((resolve, reject) => {
            const options = {
                amount: total ,
                currency: "INR",
                receipt: pkgId 
            };

            instance.orders.create(options, function (err, order) {
                if (err) {
                    console.error("Razorpay error:", err);
                    reject(err);
                } else {
                    console.log("Razorpay order created:", order);
                    resolve(order);
                }
            });
        });
    } catch (error) {
        console.error("Error in generateRazorpay:", error);
        throw new Error("Error generating Razorpay order");
    }
}

module.exports = { generateRazorpay };