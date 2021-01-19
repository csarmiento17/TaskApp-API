const sgMail = require('@sendgrid/mail')

const sendgridAPIKey ='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'

sgMail.setApiKey(sendgridAPIKey)

const msg ={

     to: 'sarmientocarlopher@gmail.com', // Change to your recipient
      from: 'sarmientocarlopher@gmail.com', // Change to your verified sender
      subject: 'Sending with SendGrid for the first time',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })