import "reflect-metadata"
import express from "express"
import { router as lecturesRouter } from "./controllers/lectureController"
import { router as studentRouter } from "./controllers/studentController"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/lectures', lecturesRouter)
app.use('/student', studentRouter)

export default app