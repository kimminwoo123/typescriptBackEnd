import { LecturesRepository } from '../src/repositories/lecturesRepository'
import { Lectures } from '../src/domains/lectures'
import { LectureRequest } from '../src/dto/lectureRequest'
import type { LectureListResult } from '../src/types/express/index'

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

}