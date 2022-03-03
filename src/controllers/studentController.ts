import { Router, Response, Request, NextFunction } from "express"
import { Container } from 'typedi'
import { body, validationResult } from "express-validator"
import { wrap } from '../util/index'
import { StudentService } from "../services/studentService"
import { Students } from '../domains/students'
import { Lectures } from '../domains/lectures'

const router = Router()

const studentService = Container.get(StudentService)

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

            const studentName = req?.body.studentName
            const email = req?.body.studentEmail

            const student: Students = Students.createStudent(undefined, studentName, email, new Date())

            const registStudent: Students = await studentService.studentRegistration(student)

            return res.status(201).send(registStudent)
        } catch (e) {
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

            const studentEmail = req?.body.studentEmail

            const student: Students = Students.createStudent(undefined, undefined, studentEmail)

            await studentService.studentWithdrawal(student)

            return res.status(204).send({ message: '탈퇴완료' })
        } catch (e) {
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

            const lectureId = req?.body.lectureId
            const studentId = req?.body.studentId

            const lecture: Lectures = Lectures.createLecture(lectureId)
            const student: Students = Students.createStudent(studentId)

            await studentService.lectureRegistration(student, lecture)

            return res.status(201).send({ message: '수강신청 완료' })
        } catch (e) {
            return res.status(500).send({ message: '서버오류' })
        }
    })
)

export { router }