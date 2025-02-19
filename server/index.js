import express from 'express';
import 'dotenv/config'
import connectDB from './db/connectDB.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import appRouter from "./routes/index.js"
const app = express();

// const PORT = process.env.PORT ||  5000;
const PORT = 5000;
// enable cors middleware

app.use(cors({
    origin: process.env.CLIENT_BASE_URL,
    methods:["GET", "POST", "DELETE", "PUT"],
    allowedHeaders:[
        "Content-Type",
        "Authorization",
        "Cache-Control",
        "Expires",
        "Pragma"
    ],
    credentials:true
}))

app.use(cookieParser());
app.use(express.json());

// this router contains all app routes
app.use(appRouter);

// handle error middleware
app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
})


connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running at port no ${PORT}`);
        
    })
})

