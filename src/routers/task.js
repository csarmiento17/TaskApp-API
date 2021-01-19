const express = require('express');
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router();


// Create a Task
router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)

    // Creates association between Task and User
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send()
    }
})



// Get all Tasks
router.get('/tasks', auth, async (req, res) => {
    const match = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    try {
        // const tasks =  await Task.find({owner: req.user._id})
    await req.user.populate({
        path: 'tasks',
        match,
        options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip)
        }
    }).execPopulate()

        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
})

// Get specific task
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        //const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id })

        if(!task){
            res.status(404).send()
        }    
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }

//    .then((task) =>{
//         if(!task){
//             res.status(400).send('Task not found')
//         }
//         res.send(task)
//     }).catch(err =>{
//         res.status(500).send()
//     })
})


router.patch('/tasks/:id', auth, async(req,res) =>{
    //convert array into an object properties
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) 

    if(!isValidOperation){
        res.status(400).send({error: 'Invalid updates'})
    }

    try {
        // id - body - options
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
       console.log(req.params.id)
       console.log(req.user._id)
       
        if(!task){
            res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(400).send()
    }
})

router.delete('/tasks/:id',auth, async(req,res) =>{
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)

        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id })

        if(!task){
            res.status(404).send()
        }

        res.send(task)

    } catch (error) {
        res.status(400).send()
    }

})

module.exports = router