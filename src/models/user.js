const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')


const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        trim: true
    }, // String is shorthand for {type: String}
    email:{
        type: String, 
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email')
            }
        }
    }, 
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){throw new Error('Age must be a positive number')}
        } 
        
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minLength : 7,
        validate(value){
          if(value.toLowerCase().includes('password')){
              throw new Error('Password cannot contain "password"')
          }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps : true
})


userSchema.virtual('tasks', {
    ref: 'Task',
    localField:'_id',
    foreignField: 'owner'
})

// Hide Token and Password in Create User and Login
userSchema.methods.toJSON = function () { 
    const user = this
    //gets value - provided by Mongoose
    const userObject = user.toObject() 

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    
    return userObject
}

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next){
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})
// Generate Token
// methods are accessible on instance methods
userSchema.methods.generateAuthToken = async function () {
    const user= this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token: token})

    await user.save()
    return token
}


// User Login
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Invalid username or password')
    }

    return user
}

// Hash the plain text passwordk
// 2nd param should be standard function coz arrow func don't bind "this"
userSchema.pre('save', async function (next) {
    const user = this

    // Has only password if user has modified Password
    // True if user is newly crated or password was updated
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)      
    }

    next()
})
const User = mongoose.model('Users', userSchema)

module.exports = User