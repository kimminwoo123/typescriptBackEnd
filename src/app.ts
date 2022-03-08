import "reflect-metadata"
import express from "express"
import { router as lecturesRouter } from "./controllers/lectureController"
import { router as studentRouter } from "./controllers/studentController"

import { EntityManager, EntityRepository, getCustomRepository } from 'typeorm'
import { LecturesRepository } from './repositories/lecturesRepository'
import { InstructorsRepository } from './repositories/instructorsRepository'
import { Instructors } from './entities/instructors'
import dayjs from "dayjs"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/lectures', lecturesRouter)
app.use('/student', studentRouter)

app.get('/', async () => {
    // const condition: LectureCondition = {
    //     category: 'infra',
    //     search: '얄팍한 코딩사전1',
    //     sortCondition: 'student_count',
    //     page: 1,
    //     pageLength: 3
    // }

    // const lr = getCustomRepository(LecutresRepository)
    // lr.findCondition(condition)

    // const inst = new Instructors()
    // inst.instructorName = 'test'
    // inst.registDate = new Date()

    // const lecture: LectureCondition = {
    //     category: 'web',
    //     search: '얄팍한 코딩사전',
    //     sortCondition: 'studentCount',
    //     page: 1,
    //     pageLength: 5
    // }

    // const instructorsRepository = getCustomRepository(LecutresRepository)
    // const result = await instructorsRepository.findConditionLecture(lecture)
    // console.log(result)
})

export default app