require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectToMongoDB } = require('./database')
const app = express()
const path = require('path')

app.use(cors())

app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'))
})

const router = require('./routes')
app.use("/api", router)

const port = process.env.PORT || 5000

async function startServer(){
    await connectToMongoDB()
    app.listen(port, () => {
        console.log(`Server is runnig on ${port}`)
    })
}

startServer()


