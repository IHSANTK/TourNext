const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user:'ihsantk786313@gmail.com',
      pass: 'rdfz ebfk dwag foab',
    },
  });

  const mailOptions = {
    from: 'ihsantk786313@gmail.com',
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;