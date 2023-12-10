import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
// to limit json data
app.use(express.json({limit: "16kb"}))
// to limit url
app.use(express.urlencoded({extended: true, limit: "16kb"}))
// to access public asset
app.use(express.static("public"))
// to access cookies from browser and set up
app.use(cookieParser())

//routes import
 
import userRouter from './routes/user.routes.js'


//routes declaration
app.use("/api/v1/users",userRouter)

// http://localhost:8000/api/v1/users/register

//export default app
export {app}
