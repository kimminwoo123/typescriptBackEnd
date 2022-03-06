import { Router, Response, Request, NextFunction } from "express"
import { wrap } from '../util/index'
import { check, body, query, validationResult } from "express-validator"
import { LectureService } from "../services/lectureService"
import { LectureRequest } from '../dto/lectureRequest'
import { LecturesRepository } from '../repositories/lecturesRepository'
import { Lectures } from '../domains/lectures'
import { Instructors } from '../domains/instructors'
import { InstructorsRepository } from '../repositories/instructorsRepository'

const router = Router()
const lectureService = new LectureService(new LecturesRepository(), new InstructorsRepository())

/**
* 강의목록 조회
* 
*/
router.get('/',
    query('category').notEmpty().isIn(['web', 'app', 'game', 'algo', 'infra', 'db', 'all']),
    query('sortCondition').notEmpty().isIn(['studentCount', 'lectureCreateDate']),
    query('searchWord').notEmpty().isString(),
    query('page').notEmpty().isInt(),
    query('pageSize').notEmpty().isInt(),
    wrap(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationError = validationResult(req)

            // validation
            if (!validationError.isEmpty()) {
                return res.status(400).send('validation error')
            }

            const searchWord = req?.query?.searchWord as LectureRequest['searchWord']
            const page = Number(req?.query?.page) as LectureRequest['page']
            const pageSize = Number(req?.query?.pageSize) as LectureRequest['pageSize']
            const sortCondition = req?.query?.sortCondition as LectureRequest['sortCondition']
            const category = req?.query?.category as LectureRequest['category']

            const request = LectureRequest.create(category, searchWord, sortCondition, page, pageSize)

            const result = await lectureService.searchCondition(request)
            return res.status(200).send(result)
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: '오류' })
        }
    }))

/**
* 강의상세 조회
* 
*/
router.get('/detail',
    query('id').notEmpty().toInt(),
    wrap(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationError = validationResult(req)

            // validation
            if (!validationError.isEmpty()) {
                return res.status(400).send('validation error')
            }

            const id = Number(req.query.id)
            const result = await lectureService.searchDetail(id)

            return res.status(200).send(result)
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: '오류' })
        }
    }))

// /**
// * 강의등록
// * 
// */
// router.post('/',
//     body('lecture_id').notEmpty(),
//     body('lecture_name').notEmpty(),
//     body('category').notEmpty().isIn(['web', 'app', 'game', 'algo', 'infra', 'db', 'all']),
//     body('lecture_introduction').notEmpty(),
//     body('lecture_price').notEmpty(),
//     body('instructor_id').notEmpty(),
//     (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const validationeError = validationResult(req)

//             // validation
//             if (!validationeError.isEmpty()) {
//                 return res.status(400).send('validation error')
//             }

//             const id = req?.body.instructor_id
//             const name = req?.body.lecture_name

//             if (typeof id === 'string' && typeof name === 'string') {
//                 lectureService.checkIdName(id, name) // 강사 id 확인, 강의이름 중복 확인
//                     .then((result) => {
//                         if (result) {
//                             lectureService.setLecture(req)
//                                 .then((rowCount) => {
//                                     if (rowCount) {
//                                         return res.status(201).send(`${rowCount}건 생성 완료`)
//                                     } else {
//                                         return res.status(500).send({ message: '생성 실패' })
//                                     }
//                                 })
//                                 .catch((err) => {
//                                     return res.status(500).send({ message: '생성 실패' })
//                                 })
//                         } else {
//                             return res.status(404).send({ message: 'id가 없거나 강의 이름이 중복입니다.' })
//                         }
//                     })
//                     .catch((err) => {
//                         return res.status(500).send({ message: '강사 id 확인, 강의이름 중복체크 오류' })
//                     })
//             } else {
//                 return res.status(500).send({ message: 'type check 오류' })
//             }
//         } catch (e) {
//             return res.status(500).send({ message: '오류' })
//         }
//     }
// )

/**
* 강의등록/ 대량등록
* 
*/
router.post('/',
    body('lectures').isArray(),
    body('lectures.*.lectureName').notEmpty().trim().isString(),
    body('lectures.*.category').notEmpty().trim().isIn(['web', 'app', 'game', 'algo', 'infra', 'db', 'all']),
    body('lectures.*.lectureIntroduction').notEmpty().trim().isString(),
    body('lectures.*.lecturePrice').notEmpty().trim().isInt(),
    body('instructorId').notEmpty().trim().isInt(),
    wrap(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationError = validationResult(req)

            // validation
            if (!validationError.isEmpty()) {
                return res.status(400).send('validation error')
            }

            if (req.body?.lectures?.length > 10) {
                return res.status(400).send({ message: '강의 생성은 10건 이하만 요청가능합니다.' })
            }

            const instructor = Instructors.createInstructor(req.body?.instructorId as Instructors['id'])
            const lectureList: Lectures[] =
                req.body?.lectures?.map((v: any) => Lectures.createLecture(
                    undefined, v.lectureName, v.category, v.lecturePrice, 0, false, new Date(), undefined, v.lectureIntroduction, undefined, instructor))

            const saveList = await lectureService.create(instructor, lectureList)

            return res.status(201).send(saveList)
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: '오류' })
        }
    }))

// /**
// * 강의수정
// * 
// */
// router.put('/',
//     body('lecture_id').notEmpty(),
//     body('lecture_name').notEmpty(),
//     body('lecture_introduction').notEmpty(),
//     body('lecture_price').notEmpty(),
//     body('instructor_id').notEmpty(),
//     (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const validationeError = validationResult(req)

//             // validation
//             if (!validationeError.isEmpty()) {
//                 return res.status(400).send('validation error')
//             }

//             const instructorId = req?.body.instructor_id
//             const lectureId = req?.body.lecture_id
//             const lectureName = req?.body.lecture_name
//             const lectureIntroduction = req.body.lecture_introduction
//             const lecturePrice = req.body.lecture_price

//             if (typeof instructorId === 'string' && typeof lectureName === 'string') {
//                 lectureService.checkIdName(instructorId, lectureName) // 강사 id 확인, 강의이름 중복 확인
//                     .then((result) => {
//                         if (result) {
//                             lectureService.modifyLecture(lectureId, lectureName, lectureIntroduction, lecturePrice)
//                                 .then((rowCount) => {
//                                     if (rowCount) {
//                                         return res.status(200).send('강의 수정 완료')
//                                     } else {
//                                         return res.status(500).send({ message: '수정 실패' })
//                                     }
//                                 })
//                                 .catch((err) => {
//                                     return res.status(500).send({ message: '생성 실패' })
//                                 })
//                         } else {
//                             return res.status(404).send({ message: 'id가 없거나 강의 이름이 중복입니다.' })
//                         }
//                     })
//                     .catch((err) => {
//                         return res.status(500).send({ message: '강사 id 확인, 강의이름 중복체크 오류' })
//                     })
//             } else {
//                 return res.status(500).send({ message: 'type check 오류' })
//             }
//         } catch (e) {
//             return res.status(500).send({ message: '오류' })
//         }
//     }
// )

// /**
// * 강의오픈
// * 
// */
// router.patch('/',
//     body('lecture_id').notEmpty(),
//     body('instructor_id').notEmpty(),
//     (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const validationeError = validationResult(req)

//             // validation
//             if (!validationeError.isEmpty()) {
//                 return res.status(400).send('validation error')
//             }

//             const instructorId = req?.body.instructor_id
//             const lectureId = req?.body.lecture_id

//             if (typeof instructorId === 'string' && typeof lectureId === 'string') {
//                 lectureService.checkId(instructorId, lectureId) // 강사 id 확인, 강의id 확인
//                     .then((result) => {
//                         if (result) {
//                             lectureService.openLecture(lectureId)
//                                 .then((rowCount) => {
//                                     if (rowCount) {
//                                         return res.status(200).send('강의 오픈 완료')
//                                     } else {
//                                         return res.status(500).send({ message: '강의 오픈 실패' })
//                                     }
//                                 })
//                                 .catch((err) => {
//                                     return res.status(500).send({ message: '강의 오픈 실패' })
//                                 })
//                         } else {
//                             return res.status(404).send({ message: '강의id 또는 강사id 오류입니다.' })
//                         }
//                     })
//                     .catch((err) => {
//                         return res.status(500).send({ message: '강의id 또는 강사id 체크 오류' })
//                     })
//             } else {
//                 return res.status(500).send({ message: 'type check 오류' })
//             }
//         } catch (e) {
//             return res.status(500).send({ message: '오류' })
//         }
//     }
// )

// /**
// * 강의삭제
// * 
// */
// router.delete('/',
//     body('lecture_id').notEmpty(),
//     body('instructor_id').notEmpty(),
//     (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const validationeError = validationResult(req)

//             // validation
//             if (!validationeError.isEmpty()) {
//                 return res.status(400).send('validation error')
//             }

//             const instructorId = req?.body.instructor_id
//             const lectureId = req?.body.lecture_id

//             if (typeof instructorId === 'string' && typeof lectureId === 'string') {
//                 lectureService.checkId(instructorId, lectureId) // 강사 id 확인, 강의id 확인
//                     .then((result) => {
//                         if (result) {
//                             lectureService.deleteLecture(lectureId)
//                                 .then((rowCount) => {
//                                     if (rowCount) {
//                                         return res.status(204).send('강의 삭제 완료')
//                                     } else {
//                                         return res.status(400).send({ message: '강의 삭제실패, 이미 수강하는 학생이 존재합니다.' })
//                                     }
//                                 })
//                                 .catch((err) => {
//                                     return res.status(500).send({ message: '강의 삭제 실패' })
//                                 })
//                         } else {
//                             return res.status(404).send({ message: '강사id 또는 강의 id가 없습니다.' })
//                         }
//                     })
//                     .catch((err) => {
//                         return res.status(500).send({ message: '강의id 또는 강사id 체크 오류' })
//                     })
//             } else {
//                 return res.status(500).send({ message: 'type check 오류' })
//             }
//         } catch (e) {
//             return res.status(500).send({ message: '서버오류' })
//         }
//     }
// )

export { router }