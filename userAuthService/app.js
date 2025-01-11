import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"

dotenv.config({
    path: './.env'
})

const app = express()



app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.json());
app.use(cookieParser());


connectDB();


//set routes

import userRoutes from "./userRoutes/routes.js"

app.use("/api/v1/users", userRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
  