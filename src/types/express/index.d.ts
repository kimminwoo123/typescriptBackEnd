import * as express from "express"

declare global {
    namespace Express {
        interface Request {
            instructor_id?: Record<string, any>
            id?: Record<string, any>
            lecture_name?: Record<string, any>
            lecture_id?: Record<string, any>
            category?: Record<string, any>
            lecture_introduction?: Record<string, any>
            lecture_price?: Record<string, any>
        }
    }

    type Category = 'web' | 'app' | 'game' | 'algo' | 'infra' | 'db'

    type SortCondition = 'studentCount' | 'lectureCreateDate'

    type LectureCondition = {
        category: Category
        search: string
        sortCondition: SortCondition
        page: number
        pageLength: number
    }

    type InstructorDto = {
        id: number
        instructorName: string
        registDate: Date
    }

    type LectureDto = {
        id: number
        lectureName: string
        category: Category
        lectureIntroduction: string
        lecturePrice: number
        studentCount: number
        openFlag: Boolean
        lectureCreateDate: Date
        lectureModifyDate: Date
    }

    type StudentDto = {
        id: number
        studentName: string
        studentEmail: string
        registDate: Date
    }

    type CourseDetailDto = {
        registDate: Date
    }

    type LectureListResult = {
        id: LectureDto['id']
        lectureName: LectureDto['lectureName']
        category: LectureDto['category']
        lectureIntroduction: LectureDto['lectureIntroduction']
        lecturePrice: LectureDto['lecturePrice']
        studentCount: LectureDto['studentCount']
        lectureCreateDate: LectureDto['lectureCreateDate']
        instructorName: InstructorDto['instructorName']
    }
}

export type { LectureListResult }