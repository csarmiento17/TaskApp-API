const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        
        // Validates header
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        // Find user with correct id who has auth token still stored, if logout token is valid
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})

        if(!user){
            throw new Error()
        }
        
        req.token = token
        req.user = user
       
        next()
    } catch (error) {
        res.status(401).send({error: 'Please authenticate'})
    }
}

module.exports = auth