import { CourseDetailsRepository } from '../src/repositories/courseDetailsRepository'
import { CourseDetails } from '../src/entities/courseDetails'

export class StubCourseDetailsRepository extends CourseDetailsRepository {
    constructor() {
        super()
    }

    override async saveByCourse(course: CourseDetails): Promise<CourseDetails> {
        return CourseDetails.createCourse(course.lecture, course.student, new Date(2022, 1, 22))
    }

    override async findById(course: CourseDetails): Promise<CourseDetails | undefined> {
        if (course.lecture.id === 1 && course.student.id === 1) {
            return CourseDetails.createCourse(course.lecture, course.student, new Date(2022, 1, 22))
        } else {
            return undefined
        }
    }
}