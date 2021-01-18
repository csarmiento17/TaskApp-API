const express = require('express');
const Task = require('../models/task')
const router = new express.Router();

// Get all Tasks
router.get('/tasks', async (req, res) => {

    try {
        const tasks =  await Task.find({})
        res.send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Get a Task
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id)
        if(!task){
            res.status(404).send('Task not found')
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

// Create a Task
router.post('/tasks',async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(err.message)
    }
})

router.patch('/tasks/:id', async(req,res) =>{
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

        const task = await Task.findById(req.params.id)

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
    
        if(!task){
            res.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(400).send()
    }
})

router.delete('/tasks/:id', async(req,res) =>{
    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if(!task){
            res.status(404).send()
        }

        res.send(task)

    } catch (error) {
        res.status(400).send()
    }

})

module.exports = router