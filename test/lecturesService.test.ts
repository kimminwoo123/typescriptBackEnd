import { LectureService } from '../src/services/lectureService'
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

    // it('studentRegistration은 수강생을 생성하고 수강생 객체를 반납한다', async () => {
    //     // give
    //     expect.assertions(1)
    //     const student = Students.createStudent(1, '말레니아', 'malenia@gmail.com', new Date(2022, 1, 22))

    //     // when
    //     const saveStudent = await studentService.studentRegistration(student)

    //     // then
    //     expect(saveStudent).toEqual({ id: 1, studentName: '말레니아', studentEmail: 'malenia@gmail.com', registDate: new Date(2022, 1, 22) })
    // })
})