import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import connectDB from './config/connect.js'
import {PORT} from './config/config.js'
dotenv.config()

const app=express()

const corsOptions={
    origin:'*',
    methods:['GET','POST','PUT','DELETE','PATCH'],
    allowedHeaders:['Content-Type','Authorizatin'],

}
app.use(cors(corsOptions))


app.use(express.json())

const start=async()=>{
try{
    await connectDB(process.env.MONGO_URI)
    app.listen({port:PORT,host:'0.0.0.0'},(err,addr)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log(`Server started on http://localhost:${PORT}`)
        }
    })
}catch(error){
console.log("Error starting server-->",error)
}
}
start();

