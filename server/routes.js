const express = require('express')
const router= express.Router()
const { getConnectedClient } = require('./database')
const {ObjectId} = require('mongodb')
const { auth} = require('./auth')


const getCollection = () => {
    const client = getConnectedClient()
    const collection = client.db('Todos').collection('todos')
    return collection;
}


// GET /todos
router.get('/todos', auth, async (req, res) => {
    const collection = getCollection();
    const todos = await collection.find({ userId: req.userId}).toArray();

    res.status(200).json(todos)
})

//POST /todos
router.post('/todos', auth, async (req, res) => {
    const collection = getCollection();
    let {todo} = req.body;

    if(!todo){
       return res.status(400).json({mssg: 'error no todo found'});
    }

    todo = (typeof todo === 'string') ? todo : JSON.stringify(todo);

    const newTodo = await collection.insertOne({
        todo, 
        status:false,
        userId: req.userId,
        createdAt: new Date()
    });

    
    res.status(201).json({
        todo, 
        status:false,
        _id:newTodo.insertedId,
        userId: req.userId
    })
})

//DELETE /todos/:id
router.delete('/todos/:id', auth, async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);

    const deletedTodo = await collection.deleteOne({
        _id,
        userId: req.userId
    });


    res.status(200).json(deletedTodo)
})

//PUT /todos/:id
router.put('/todos/:id', auth, async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const {status} = req.body;

    if(typeof status !== 'boolean') {
        return res.status(400).json({mssg: 'invalid status'});
    }

    const updatedTodo = await collection.updateOne({
        _id, userId: req.userId}, 
        {$set: {status}}
    );




    res.status(200).json(updatedTodo)
})

module.exports = router