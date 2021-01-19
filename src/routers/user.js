const express = require('express');
const multer = require('multer');
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')

// Create User
router.post('/users', async (req,res) => {
    const user = new User(req.body);

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

// User Login
router.post('/users/login', async (req, res) => {
    try {        
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})

    } catch (error) {
        res.status(400).send()
    }
})

// Get all Users
router.get('/users/me', auth,  async (req, res) => {
    // try {
    //     const users = await User.find({})
    //     res.send(users)
    // } catch (error) {
    //     res.status(500).send()
    // }

    res.send(req.user)

})


// User's Logout
router.post('/users/logout', auth, async(req, res) => {
    try {
            req.user.tokens = req.user.tokens.filter((token) =>{
               
            return token.token !== req.token
        })

        await req.user.save()

        res.send('Successfully Logged out')
    } catch (error) {
        res.status(500).send()
    }
})

// Logout all Users
router.post('/users/logoutAll', auth, async(req, res) =>{
    try {

        req.user.tokens = []
        await req.user.save()

        res.send('All users has been logged out')
        
    } catch (error) {
        res.status(500).send()
    }
})



// Update Logon User
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(404).send({error: 'Invalid Updates'})
    }
  
    try {
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        
        // Code above was adjusted get the middleware consistently running
        //const user = await User.findById(req.params.id)

        updates.forEach((update) => {
            // Dynamically update the properties
            req.user[update]= req.body[update]
        })

        await req.user.save()        
        res.send(req.user)

    } catch (error) {
        res.status(400).send(error)
    }
})

// Delete Log on User
router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)

        // if(!user){
        //     res.status(404).send()
        // }
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(400).send()
    }
})

const upload = multer({
    dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter (req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})
router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
    res.send()
})


// Get Individual User - commented due to only your user should you see and get
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id)
//         if(!user){
//             return res.status(404).send('User not found')
//         }

//         res.send(user)
//     } catch (error) {
//         res.status(500).send(err.message)
//     }
// })
module.exports = router