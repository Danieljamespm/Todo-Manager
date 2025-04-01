require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectToMongoDB } = require('./database')
const todoRoutes = require('./routes')
const userRoutes = require('./userRoutes')
const path = require('path')

const app = express()
const port = process.env.PORT || 5000

// Configure CORS to allow requests from your frontend
app.use(cors({
    origin: 'http://localhost:5173', // Vite's default port
    credentials: true
}))

//MiddleWare 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')))

// API routes first
app.use("/api", todoRoutes)
app.use("/api/users", userRoutes)

// Static and catch-all routes last
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

async function startServer(){
    try {
        await connectToMongoDB()
        app.listen(port, () => {
            console.log(`Server is running on ${port}`)
        })
    } catch (error) {
        console.error('Failed to start server:', error)
    }
}

startServer()
