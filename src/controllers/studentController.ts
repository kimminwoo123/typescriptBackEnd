import { Router, Response, Request, NextFunction } from "express"
import { body, validationResult } from "express-validator"
import { wrap } from '../util/index'
import { StudentService } from "../services/studentService"
import { StudentsRepository } from '../repositories/studentsRepository'
import { LecturesRepository } from '../repositories/lecturesRepository'
import { CourseDetailsRepository } from '../repositories/courseDetailsRepository'
import { Students } from '../entities/students'
import { Lectures } from '../entities/lectures'

const router = Router()
const studentService = new StudentService(new StudentsRepository(), new LecturesRepository(), new CourseDetailsRepository())

/**
* 수강생 가입
* 
*/
router.post('/',
    body('studentName').notEmpty(),
    body('studentEmail').notEmpty().isEmail(),
    wrap(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationError = validationResult(req)

            // validation
            if (!validationError.isEmpty()) {
                return res.status(400).send('validation error')
            }

            const studentName = req?.body?.studentName
            const email = req?.body?.studentEmail

            const student: Students = Students.createStudent(undefined, studentName, email, new Date())

            const registStudent: Students = await studentService.studentRegistration(student)

            return res.status(201).send({ message: '가입완료', data: registStudent })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: '서버오류' })
        }
    })
)

/**
* 수강생 탈퇴
* 
*/
router.delete('/',
    body('studentEmail').notEmpty().isEmail(),
    wrap(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationError = validationResult(req)

            // validation
            if (!validationError.isEmpty()) {
                return res.status(400).send('validation error')
            }

            const studentEmail = req?.body?.studentEmail

            const student: Students = Students.createStudent(undefined, undefined, studentEmail)

            const deleteStudent: Students = await studentService.studentWithdrawal(student)

            return res.status(204).send({ message: '탈퇴완료', data: deleteStudent })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: '서버오류' })
        }
    })
)

/**
* 수강생 강의 신청
* 
*/
router.post('/courseRequest',
    body('lectureId').notEmpty(),
    body('studentId').notEmpty(),
    wrap(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationError = validationResult(req)

            // validation
            if (!validationError.isEmpty()) {
                return res.status(400).send('validation error')
            }

            const lectureId = req?.body?.lectureId
            const studentId = req?.body?.studentId

            const lecture: Lectures = Lectures.createLecture(lectureId)
            const student: Students = Students.createStudent(studentId)

            await studentService.lectureRegistration(student, lecture)

            return res.status(201).send({ message: '수강신청 완료' })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: '서버오류' })
        }
    })
)

export { router }