import { Router, Response, Request, NextFunction } from "express"
import { Container, Service } from 'typedi'
import { check, body, query, validationResult } from "express-validator"
import { LectureService } from "../services/lectureService"

const router = Router()

const lectureService = Container.get(LectureService)

/**
* 강의목록 조회
* 
*/
router.get('/',
    query('category').notEmpty().isIn(['web', 'app', 'game', 'algo', 'infra', 'db', 'all']),
    query('sort').notEmpty().isIn(['student_count', 'lecture_create_date']),
    query('search').notEmpty(),
    query('page').notEmpty(),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationeError = validationResult(req)

            // validation
            if (!validationeError.isEmpty()) {
                return res.status(400).send('validation error')
            }

            const searchWord = req?.query?.search
            const page = Number(req?.query?.page) || 1
            const sort = req?.query?.sort
            const category = req?.query?.category

            if (typeof searchWord === 'string' && typeof sort === 'string' && typeof category === 'string') {
                lectureService.lectureList(searchWord, page, sort, category)
                    .then((result) => {
                        if (result.length) {
                            return res.status(200).send(result)
                        } else {
                            return res.status(404).send({ message: '강의목록조회 결과가 없습니다.' })
                        }
                    })
                    .catch((e) => {
                        return res.status(500).send({ message: '오류' })
                    })
            } else {
                return res.status(500).send({ message: '오류' })
            }
        } catch (e) {
            return res.status(500).send({ message: '오류' })
        }
    })

/**
* 강의상세 조회
* 
*/
router.get('/detail',
    query('id').notEmpty(),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationeError = validationResult(req)

            // validation
            if (!validationeError.isEmpty()) {
                return res.status(400).send('validation error')
            }

            const id = req.query.id
            if (typeof id === 'string') {
                lectureService.lectuerDetail(id)
                    .then((result) => {
                        if (!result.length) {
                            return res.status(404).send({ message: '강의상세조회 결과가 없습니다.' })
                        } else {
                            return res.status(200).send(result)
                        }
                    })
                    .catch((e) => {
                        return res.status(500).send({ message: '오류' })
                    })
            } else {
                return res.status(500).send({ message: '오류' })
            }
        } catch (e) {
            return res.status(500).send({ message: '오류' })
        }
    }
)

/**
* 강의등록
* 
*/
router.post('/',
    body('lecture_id').notEmpty(),
    body('lecture_name').notEmpty(),
    body('category').notEmpty().isIn(['web', 'app', 'game', 'algo', 'infra', 'db', 'all']),
    body('lecture_introduction').notEmpty(),
    body('lecture_price').notEmpty(),
    body('instructor_id').notEmpty(),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationeError = validationResult(req)

            // validation
            if (!validationeError.isEmpty()) {
                return res.status(400).send('validation error')
            }

            const id = req?.body.instructor_id
            const name = req?.body.lecture_name

            if (typeof id === 'string' && typeof name === 'string') {
                lectureService.checkIdName(id, name) // 강사 id 확인, 강의이름 중복 확인
                    .then((result) => {
                        if (result) {
                            lectureService.setLecture(req)
                                .then((rowCount) => {
                                    if (rowCount) {
                                        return res.status(201).send(`${rowCount}건 생성 완료`)
                                    } else {
                                        return res.status(500).send({ message: '생성 실패' })
                                    }
                                })
                                .catch((err) => {
                                    return res.status(500).send({ message: '생성 실패' })
                                })
                        } else {
                            return res.status(404).send({ message: 'id가 없거나 강의 이름이 중복입니다.' })
                        }
                    })
                    .catch((err) => {
                        return res.status(500).send({ message: '강사 id 확인, 강의이름 중복체크 오류' })
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
* 강의등록/ 대량등록
* 
*/
router.post('/blocks',
    body('data').isArray(),
    body('data.*.lecture_id').notEmpty(),
    body('data.*.lecture_name').notEmpty(),
    body('data.*.category').notEmpty().isIn(['web', 'app', 'game', 'algo', 'infra', 'db', 'all']),
    body('data.*.lecture_introduction').notEmpty(),
    body('data.*.lecture_price').notEmpty(),
    body('data.*.instructor_id').notEmpty(),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationeError = validationResult(req)

            // validation
            if (!validationeError.isEmpty()) {
                return res.status(400).send('validation error')
            }

            if (req.body.data.length > 10) {
                return res.status(400).send({ message: '요청건수가 너무 많습니다.' })
            }

            const instructorIdList = req.body?.data?.map((v: any) => v.instructor_id)
            const lectureNameList = req.body?.data?.map((v: any) => v.lecture_name)

            lectureService.checkListIdName(instructorIdList, lectureNameList, req) // 강사 id 확인, 강의이름 중복 확인
                .then((filterList) => {
                    if (filterList.length) {
                        lectureService.setLectures(filterList)
                            .then((result) => {
                                return res.status(201).send(result)
                            })
                            .catch((err) => {
                                return res.status(500).send({ message: '생성 실패' })
                            })
                    } else {
                        return res.status(400).send({ message: '등록할 강의가 없습니다.' })
                    }
                })
                .catch((err) => {
                    return res.status(500).send({ message: '강사 id,강의이름 체크 오류' })
                })
        } catch (e) {
            return res.status(500).send({ message: '오류' })
        }
    }
)

/**
* 강의수정
* 
*/
router.put('/',
    body('lecture_id').notEmpty(),
    body('lecture_name').notEmpty(),
    body('lecture_introduction').notEmpty(),
    body('lecture_price').notEmpty(),
    body('instructor_id').notEmpty(),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationeError = validationResult(req)

            // validation
            if (!validationeError.isEmpty()) {
                return res.status(400).send('validation error')
            }

            const instructorId = req?.body.instructor_id
            const lectureId = req?.body.lecture_id
            const lectureName = req?.body.lecture_name
            const lectureIntroduction = req.body.lecture_introduction
            const lecturePrice = req.body.lecture_price

            if (typeof instructorId === 'string' && typeof lectureName === 'string') {
                lectureService.checkIdName(instructorId, lectureName) // 강사 id 확인, 강의이름 중복 확인
                    .then((result) => {
                        if (result) {
                            lectureService.modifyLecture(lectureId, lectureName, lectureIntroduction, lecturePrice)
                                .then((rowCount) => {
                                    if (rowCount) {
                                        return res.status(200).send('강의 수정 완료')
                                    } else {
                                        return res.status(500).send({ message: '수정 실패' })
                                    }
                                })
                                .catch((err) => {
                                    return res.status(500).send({ message: '생성 실패' })
                                })
                        } else {
                            return res.status(404).send({ message: 'id가 없거나 강의 이름이 중복입니다.' })
                        }
                    })
                    .catch((err) => {
                        return res.status(500).send({ message: '강사 id 확인, 강의이름 중복체크 오류' })
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
* 강의오픈
* 
*/
router.patch('/',
    body('lecture_id').notEmpty(),
    body('instructor_id').notEmpty(),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationeError = validationResult(req)

            // validation
            if (!validationeError.isEmpty()) {
                return res.status(400).send('validation error')
            }

            const instructorId = req?.body.instructor_id
            const lectureId = req?.body.lecture_id

            if (typeof instructorId === 'string' && typeof lectureId === 'string') {
                lectureService.checkId(instructorId, lectureId) // 강사 id 확인, 강의id 확인
                    .then((result) => {
                        if (result) {
                            lectureService.openLecture(lectureId)
                                .then((rowCount) => {
                                    if (rowCount) {
                                        return res.status(200).send('강의 오픈 완료')
                                    } else {
                                        return res.status(500).send({ message: '강의 오픈 실패' })
                                    }
                                })
                                .catch((err) => {
                                    return res.status(500).send({ message: '강의 오픈 실패' })
                                })
                        } else {
                            return res.status(404).send({ message: '강의id 또는 강사id 오류입니다.' })
                        }
                    })
                    .catch((err) => {
                        return res.status(500).send({ message: '강의id 또는 강사id 체크 오류' })
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
* 강의삭제
* 
*/
router.delete('/',
    body('lecture_id').notEmpty(),
    body('instructor_id').notEmpty(),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationeError = validationResult(req)

            // validation
            if (!validationeError.isEmpty()) {
                return res.status(400).send('validation error')
            }

            const instructorId = req?.body.instructor_id
            const lectureId = req?.body.lecture_id

            if (typeof instructorId === 'string' && typeof lectureId === 'string') {
                lectureService.checkId(instructorId, lectureId) // 강사 id 확인, 강의id 확인
                    .then((result) => {
                        if (result) {
                            lectureService.deleteLecture(lectureId)
                                .then((rowCount) => {
                                    if (rowCount) {
                                        return res.status(204).send('강의 삭제 완료')
                                    } else {
                                        return res.status(400).send({ message: '강의 삭제실패, 이미 수강하는 학생이 존재합니다.' })
                                    }
                                })
                                .catch((err) => {
                                    return res.status(500).send({ message: '강의 삭제 실패' })
                                })
                        } else {
                            return res.status(404).send({ message: '강사id 또는 강의 id가 없습니다.' })
                        }
                    })
                    .catch((err) => {
                        return res.status(500).send({ message: '강의id 또는 강사id 체크 오류' })
                    })
            } else {
                return res.status(500).send({ message: 'type check 오류' })
            }
        } catch (e) {
            return res.status(500).send({ message: '서버오류' })
        }
    }
)

export { router }