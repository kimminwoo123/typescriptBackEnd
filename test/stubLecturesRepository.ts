import { LecturesRepository } from '../src/repositories/lecturesRepository'
import { Lectures } from '../src/domains/lectures'
import { LectureRequest } from '../src/dto/lectureRequest'
import type { LectureListResult } from '../src/types/express/index'
import { CourseDetails } from '../src/domains/courseDetails'
import { Students } from '../src/domains/students'


export class StubLecturesRepository extends LecturesRepository {
    constructor() {
        super()
    }

    override async findById(id: Lectures['id']): Promise<Lectures | undefined> {
        if (id === 2) {
            return Lectures.createLecture(2, '테스트', 'algo', 12300, 32, true, new Date(2022, 1, 22), undefined, '테스트입니다')
        } else if (id === 1) {
            return Lectures.createLecture(1, '갖고노는 MySQL 데이터베이스 by 얄코', 'db', 14300, 444, true, new Date(2022, 1, 22), undefined, '비전공자도 이해할 수 있는 MySQL! 빠른 설명으로 필수개념만 훑은 뒤 사이트의 예제들과 함께 MySQL을 ‘갖고 놀면서’ 손으로 익힐 수 있도록 만든 강좌입니다.')
        } else if (id === 3) {
            return Lectures.createLecture(3, '노드 js', 'web', 9999, 0, false, new Date(2022, 1, 22), undefined, '노드 js 강의입니다')
        } else {
            return undefined
        }
    }

    override async findByName(name: Lectures['lectureName']): Promise<Lectures | undefined> {
        if (name === '테스트') {
            return Lectures.createLecture(4, '테스트', 'algo', 444, 0, false, new Date(2022, 1, 1), undefined, '테스트 강의입니다.')
        } else {
            return undefined
        }
    }

    override async findConditionSearch(lectureRequest: LectureRequest): Promise<LectureListResult[]> {
        if (lectureRequest.getCategory() === 'web') {
            const result: LectureListResult = {
                id: 6,
                category: 'web',
                lectureName: 'vex',
                lecturePrice: 26700,
                studentCount: 343,
                lectureCreateDate: new Date(2022, 2, 12),
                lectureIntroduction: '복붙하며, Rea',
                instructorName: '얄팍한 코딩사전',
            }
            return [result]
        } else {
            return []
        }
    }

    override async findDetailSearch(id: Lectures['id']): Promise<Lectures | undefined> {
        const lecture = Lectures.createLecture(1, '갖고노는 MySQL 데이터베이스 by 얄코', 'db', 14300, 444, true, new Date(2022, 1, 3), new Date(2022, 1, 4),
            '비전공자도 이해할 수 있는 MySQL! 빠른 설명으로 필수개념만 훑은 뒤 사이트의 예제들과 함께 MySQL을 ‘갖고 놀면서’ 손으로 익힐 수 있도록 만든 강좌입니다.')
        // const student = Students.createStudent(2)
        // const course = CourseDetails.createCourse(lecture, student, new Date(2021, 12, 1))
        if (id === 1) {
            return lecture
        } else {
            return undefined
        }
    }

    override async saveLectures(lectureList: Lectures[]): Promise<Lectures[]> {
        return [
            Lectures.createLecture(1, 'cnc', 'web', 1234, 0, false, new Date(2022, 1, 1), undefined, 'Cnc 강의입니다.'),
            Lectures.createLecture(2, 'bnb', 'game', 5353, 0, false, new Date(2022, 1, 1), undefined, 'bnb 강의입니다.'),
        ]
    }

    override async updateLecture(lecture: Lectures): Promise<Lectures> {
        lecture.category = 'web'
        lecture.studentCount = 0
        lecture.openFlag = false
        lecture.lectureModifyDate = new Date(2022, 3, 5)

        return lecture
    }

    override async deleteLecture(lecture: Lectures): Promise<Lectures> {
        return Lectures.createLecture(lecture.id,
            '타입스크립트 강의',
            'web',
            120000,
            0,
            false,
            new Date(2022, 3, 1),
            new Date(2022, 3, 4),
            '타입스크립트 강의입니다.')
    }
}