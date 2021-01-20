const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'Connection Error:'));
// db.once('open', function() {
//     console.log('we are connected!')
// });



