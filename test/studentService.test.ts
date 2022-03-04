import { StudentService } from '../src/services/studentService'
import { StubStudentsRepository } from './stubStudentsRepository'
import { StubLecturesRepository } from './stubLecturesRepository'
import { StubCourseDetailsRepository } from './stubCourseDetailsRepository'
import { Students } from '../src/domains/students'
import { Lectures } from '../src/domains/lectures'
import { CourseDetails } from '../src/domains/courseDetails'

describe('StudentService', () => {
    let studentService = new StudentService(new StubStudentsRepository(), new StubLecturesRepository(), new StubCourseDetailsRepository())

    beforeEach(() => {
        studentService = new StudentService(new StubStudentsRepository(), new StubLecturesRepository(), new StubCourseDetailsRepository())
    })

    it('studentRegistration은 수강생을 생성하고 수강생 객체를 반납한다', async () => {
        // give
        expect.assertions(1)
        const student = Students.createStudent(1, '말레니아', 'malenia@gmail.com', new Date(2022, 1, 22))

        // when
        const saveStudent = await studentService.studentRegistration(student)

        // then
        expect(saveStudent).toEqual({ id: 1, studentName: '말레니아', studentEmail: 'malenia@gmail.com', registDate: new Date(2022, 1, 22) })
    })

    it('studentRegistration은 email 중복시 error 반환', async () => {
        // give
        expect.assertions(1)
        const student = Students.createStudent(2, '게롤트', 'gerolt@gmail.com', new Date(2022, 1, 22))

        // when
        await expect(studentService.studentRegistration(student))
            .rejects
            // then
            .toThrow('email 중복')
    })

    it('studentWithdrawal은 수강생 탈퇴시 수강생 객체 반납', async () => {
        // give
        expect.assertions(1)
        const student = Students.createStudent(2, '게롤트', 'gerolt@gmail.com', new Date(2022, 1, 22))

        // when
        const deleteStudent = await studentService.studentWithdrawal(student)

        // then
        expect(deleteStudent).toEqual({ id: 2, studentName: '게롤트', studentEmail: 'gerolt@gmail.com', registDate: new Date(2022, 1, 22) })
    })

    it('studentWithdrawal은 가입되지 않은 수강생를 받을시 error 반환', async () => {
        // give
        expect.assertions(1)
        const student = Students.createStudent(1, '말레니아', 'malenia@gmail.com', new Date(2022, 1, 22))

        // when
        await expect(studentService.studentWithdrawal(student))
            .rejects
            // then
            .toThrow('존재하지 않는 id입니다')
    })

    it('lectureRegistration은 학생id와 강의id를 받아 수강신청 결과 반납', async () => {
        // give
        expect.assertions(1)
        const student = Students.createStudent(1)
        const lecture = Lectures.createLecture(2)

        // when
        const courseResult = await studentService.lectureRegistration(student, lecture)

        // then
        const course = CourseDetails.createCourse(lecture, student, new Date(2022, 1, 22))
        expect(courseResult).toEqual(course)
    })

    it('lectureRegistration은 가입되지 않은 학생일때 error 반환', async () => {
        // give
        expect.assertions(1)
        const student = Students.createStudent(2)
        const lecture = Lectures.createLecture(2)

        // when
        await expect(studentService.lectureRegistration(student, lecture))
            .rejects
            // then
            .toThrow('존재하지 않는 학생 id입니다')
    })

    it('lectureRegistration은 생성되지 않은 강의일때 error 반환', async () => {
        // give
        expect.assertions(1)
        const student = Students.createStudent(1)
        const lecture = Lectures.createLecture(4)

        // when
        await expect(studentService.lectureRegistration(student, lecture))
            .rejects
            // then
            .toThrow('존재하지 않는 강의 id입니다')
    })

    it('lectureRegistration은 신청할수 없는 강의일때 error 반환', async () => {
        // give
        expect.assertions(1)
        const student = Students.createStudent(1)
        const lecture = Lectures.createLecture(3)

        // when
        await expect(studentService.lectureRegistration(student, lecture))
            .rejects
            // then
            .toThrow('신청할 수 없는 강의입니다')
    })

    it('lectureRegistration은 이미 강의 신청되어 있을때 error 반환', async () => {
        // give
        expect.assertions(1)
        const student = Students.createStudent(1)
        const lecture = Lectures.createLecture(1)

        // when
        await expect(studentService.lectureRegistration(student, lecture))
            .rejects
            // then
            .toThrow('이미 강의신청이 되어 있습니다')
    })
})