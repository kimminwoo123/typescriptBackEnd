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

    it('conditionSearch 조건에 따른 강의를 반납한다.', async () => {
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