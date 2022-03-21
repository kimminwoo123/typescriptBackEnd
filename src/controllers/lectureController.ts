import { Router, Response, Request, NextFunction } from "express"
import { wrap } from '../util/index'
import { check, body, query, validationResult } from "express-validator"
import { LectureService } from "../services/lectureService"
import { LectureRequest } from '../dto/lectureRequest'
import { LecturesRepository } from '../repositories/lecturesRepository'
import { Lectures } from '../entities/lectures'
import { Instructors } from '../entities/instructors'
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

            const request = new LectureRequest(category, searchWord, sortCondition, page, pageSize)

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

/**
* 강의수정
* 
*/
router.put('/',
    body('id').notEmpty().isInt(),
    body('lectureName').notEmpty().isString(),
    body('lectureIntroduction').notEmpty().isString(),
    body('lecturePrice').notEmpty().isInt(),
    body('instructorId').notEmpty().isInt(),
    wrap(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationError = validationResult(req)

            // validation
            if (!validationError.isEmpty()) {
                return res.status(400).send('validation error')
            }

            const lectureId = req?.body?.id
            const lectureName = req?.body?.lectureName
            const lectureIntroduction = req?.body?.lectureIntroduction
            const lecturePrice = req?.body?.lecturePrice

            const instructor = Instructors.createInstructor(req.body?.instructorId)
            const lecture = Lectures.createLecture(lectureId, lectureName, undefined, lecturePrice, undefined, undefined, undefined, new Date(), lectureIntroduction)

            const result = await lectureService.update(instructor, lecture)
            return res.status(200).send(result)
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: '오류' })
        }
    }))

/**
* 강의오픈
* 
*/
router.patch('/',
    body('id').notEmpty().isInt(),
    body('instructorId').notEmpty().isInt(),
    wrap(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationError = validationResult(req)

            // validation
            if (!validationError.isEmpty()) {
                return res.status(400).send('validation error')
            }

            const instructor = Instructors.createInstructor(req?.body?.instructorId)
            const lecture = Lectures.createLecture(req?.body?.id, undefined, undefined, undefined, undefined, true)

            const result = await lectureService.update(instructor, lecture)
            return res.status(200).send(result)
        } catch (e) {
            return res.status(500).send({ message: '오류' })
        }
    }))

/**
* 강의삭제
* 
*/
router.delete('/',
    body('id').notEmpty(),
    body('instructorId').notEmpty(),
    wrap(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationError = validationResult(req)

            // validation
            if (!validationError.isEmpty()) {
                return res.status(400).send('validation error')
            }

            const instructor = Instructors.createInstructor(req?.body?.instructorId)
            const lecture = Lectures.createLecture(req?.body?.id, undefined, undefined, undefined, undefined, true)

            const result = await lectureService.delete(instructor, lecture)
            return res.status(204).send(result)
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: '서버오류' })
        }
    }))

export { router }