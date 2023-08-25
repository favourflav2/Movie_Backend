import express from "express";
import cors from 'cors'
import dotenv from "dotenv"
import morgan from "morgan";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import helmet from 'helmet'

const app = express()


// Middleware
dotenv.config();
app.use(helmet())
app.use(express.urlencoded({limit:"30mb",extended:true}))
app.use(express.json({limit:"30mb",extended:true}))
// cors options
const whiteList = [`${process.env.PRODUCTION_URL}`,`${process.env.LOCALHOST_URL}`]
var corsOptions = {
    origin: function (origin, callback) {
      if (whiteList .indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }
app.use(cors())
app.use(morgan("dev"))

const port = process.env.PORT ||  5001

// Mongoose
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL).then(()=>{
    app.listen(port,()=>{
        console.log(`listening on port ${port}`)
    })
}).catch(e=>{
    console.log(e)
})

app.get('/',cors(),(req,res)=>{
  console.log("Hello, this is the backend server")
  res.send("Hello, this is the backend server")
})

app.use("/auth",cors(corsOptions),authRoutes)

