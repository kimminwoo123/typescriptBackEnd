import { LectureService } from '../src/services/lectureService'
import { LectureRequest } from '../src/dto/lectureRequest'
import { StubStudentsRepository } from './stubStudentsRepository'
import { StubLecturesRepository } from './stubLecturesRepository'
import { StubCourseDetailsRepository } from './stubCourseDetailsRepository'
import { Students } from '../src/domains/students'
import { Lectures } from '../src/domains/lectures'
import { CourseDetails } from '../src/domains/courseDetails'

describe('LecturesService', () => {
    let lectureService = new LectureService(new StubLecturesRepository())

    beforeEach(() => {
        lectureService = new LectureService(new StubLecturesRepository())
    })

    describe('searchCondition', () => {
        it('조건에 따른 강의를 검색한다', async () => {
            // give
            expect.assertions(2)
            const request = LectureRequest.create('web', '노드js', 'studentCount', 1, 3)

            // when
            const saveStudent = await lectureService.searchCondition(request)

            // then
            expect(saveStudent).toHaveLength(1)
            expect(saveStudent).toStrictEqual([{
                id: 6,
                category: 'web',
                lectureName: 'vex',
                lecturePrice: 26700,
                studentCount: 343,
                lectureCreateDate: new Date(2022, 2, 12),
                lectureIntroduction: '복붙하며, Rea',
                instructorName: '얄팍한 코딩사전',
            }])
        })
    })
    describe('searchDetail', () => {
        it('강의 상세 내역을 검색한다', async () => {
            // give
            expect.assertions(1)
            const lectureId = 1

            // when
            const saveStudent = await lectureService.searchDetail(lectureId)

            // then
            expect(saveStudent).toEqual({
                id: 1,
                lectureName: '갖고노는 MySQL 데이터베이스 by 얄코',
                category: 'db',
                lectureIntroduction: '비전공자도 이해할 수 있는 MySQL! 빠른 설명으로 필수개념만 훑은 뒤 사이트의 예제들과 함께 MySQL을 ‘갖고 놀면서’ 손으로 익힐 수 있도록 만든 강좌입니다.',
                lecturePrice: 14300,
                studentCount: 444,
                openFlag: true,
                lectureCreateDate: new Date(2022, 1, 3),
                lectureModifyDate: new Date(2022, 1, 4),
                // courseDetail: [{
                //     registDate: new Date(2022, 1, 4),
                //     student: [{
                //         id: 1,
                //         studentName: "별주부",
                //         studentEmail: "qwer@gmail.com",
                //         registDate: new Date(2022, 1, 1)
                //     }]
                // }]
            })
        })

        it('없는 강의 id일 때 error', async () => {
            // give
            expect.assertions(1)
            const lectureId = 4

            // when
            await expect(lectureService.searchDetail(lectureId))
                .rejects
                // then
                .toThrow('잘못된 강의 id 입니다.')
        })

        it('open 되지않은 강의일때 error', async () => {
            // give
            expect.assertions(1)
            const lectureId = 3

            // when
            await expect(lectureService.searchDetail(lectureId))
                .rejects
                // then
                .toThrow('오픈 되지 않은 강의 입니다.')
        })
    })
})