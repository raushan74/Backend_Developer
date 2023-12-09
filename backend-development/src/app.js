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

//export default app
export {app}
