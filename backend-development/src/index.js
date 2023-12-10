// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})




connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(` Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGO db connection failed !!!", err);
})













// another method to connect with mongodb
/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express"
const app = express()

    (async () => {
        try {
            mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
            app.on("error", (error) => {
                console.log("ERR: ", error);
                throw error
            })

            app.listen(proces.ens.PORT, () => {
                console.log(`appp is listening on port $
            {process.env.PORT}`);
            })
        } catch (error) {
            console.error("ERROR: ", error);
            throw err;
        }
    })(); //IIFE expression

*/    
