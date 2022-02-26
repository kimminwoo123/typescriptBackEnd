import { Router, Response, Request, NextFunction } from "express"
import { Container, Service } from 'typedi'
import { check, body, query, validationResult } from "express-validator"
import { StudentService } from "../services/studentService"

const router = Router()

const studentService = Container.get(StudentService)

/**
* 수강생 가입
* 
*/
router.post('/',
    body('student_id').notEmpty(),
    body('student_name').notEmpty(),
    body('email').notEmpty().isEmail(),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationeError = validationResult(req)

            // validation
            if (!validationeError.isEmpty()) {
                return res.status(400).send('validation error')
            }

            const id = req?.body.student_id
            const studentName = req?.body.student_name
            const email = req?.body.email

            if (typeof id === 'string' && typeof email === 'string') {
                studentService.checkIdEmail(id, email) // 학생 id, eamil 확인
                    .then((result) => {
                        if (result) {
                            studentService.createStudent(id, studentName, email)
                                .then((rowCount) => {
                                    if (rowCount) {
                                        return res.status(201).send(`가입 완료`)
                                    } else {
                                        return res.status(500).send({ message: '가입 실패' })
                                    }
                                })
                                .catch((err) => {
                                    return res.status(500).send({ message: '가입 실패' })
                                })
                        } else {
                            return res.status(404).send({ message: 'id가 없거나 강의 이름이 중복입니다.' })
                        }
                    })
                    .catch((err) => {
                        return res.status(500).send({ message: '학생 id,email 중복체크 오류' })
                    })
            } else {
                return res.status(500).send({ message: 'type check 오류' })
            }
        } catch (e) {
            return res.status(500).send({ message: '오류' })
        }
    }
)

/**
* 수강생 탈퇴
* 
*/
router.delete('/',
    body('student_id').notEmpty(),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationeError = validationResult(req)

            // validation
            if (!validationeError.isEmpty()) {
                return res.status(400).send('validation error')
            }

            const studentId = req?.body.student_id

            if (typeof studentId === 'string') {
                studentService.checkId(studentId)
                    .then((result) => {
                        if (!result) {
                            studentService.deleteStudent(studentId)
                                .then((rowCount) => {
                                    if (rowCount) {
                                        return res.status(204).send('수강생 탈퇴 완료')
                                    } else {
                                        return res.status(500).send({ message: '수강생 탈퇴 실패' })
                                    }
                                })
                                .catch((err) => {
                                    return res.status(500).send({ message: '수강생 탈퇴 실패' })

                                })
                        } else {
                            return res.status(404).send({ message: '수강생 id가 없습니다.' })
                        }
                    })
                    .catch((err) => {
                        return res.status(500).send({ message: '수강생 id체크 오류' })
                    })
            } else {
                return res.status(500).send({ message: 'type check 오류' })
            }
        } catch (e) {
            return res.status(500).send({ message: '서버오류' })
        }
    }
)

/**
* 수강생 강의 신청
* 
*/
router.post('/course_req',
    body('data').isArray(),
    body('data.*.lecture_id').notEmpty(),
    body('data.*.student_id').notEmpty(),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationeError = validationResult(req)

            // validation
            if (!validationeError.isEmpty()) {
                return res.status(400).send('validation error')
            }

            const lectureIdList = req.body?.data?.map((v: any) => v.lecture_id)
            const studnetIdList = req.body?.data?.map((v: any) => v.student_id)

            studentService.checkCourese(lectureIdList, studnetIdList, req)
                .then((result) => {
                    if (result.length) {
                        studentService.reqCourese(result)
                            .then((rows) => {
                                return res.status(201).send(rows)
                            })
                            .catch((err) => {
                                return res.status(400).send({ message: '수강 신청 실패, 잘못된 id거나 이미 수강중입니다.' })
                            })
                    } else {
                        return res.status(404).send({ message: '신청할 id가 없습니다.' })
                    }
                })
                .catch((err) => {
                    return res.status(500).send({ message: 'id체크 오류' })
                })

        } catch (e) {
            return res.status(500).send({ message: '서버오류' })
        }
    }
)

export { router }