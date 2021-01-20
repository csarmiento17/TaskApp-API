const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name) => {
    sgMail
    .send({
        to: email, // Change to your recipient
        from: 'sarmientocarlopher@gmail.com', // Change to your verified sender
        subject: 'Thanks for joining',
        text: `Welcome to the app, ${name}`       
    })
    
}

const sendCancelationEmail = (email,name) => {
    sgMail
    .send({
        to: email, // Change to your recipient
        from: 'sarmientocarlopher@gmail.com', // Change to your verified sender
        subject: 'Sorry to see you go',
        text: `Please let us know how we are able to make you stay, ${name}`       
    })
    
}

module.exports = {sendWelcomeEmail, sendCancelationEmail}