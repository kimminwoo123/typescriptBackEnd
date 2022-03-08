import { Repository, EntityRepository, createQueryBuilder } from 'typeorm'
import { CourseDetails } from '../entities/courseDetails'

@EntityRepository(CourseDetails)
export class CourseDetailsRepository extends Repository<CourseDetails> {
    constructor() {
        super()
    }

    public async saveByCourse(course: CourseDetails): Promise<CourseDetails> {
        const saveResult = await createQueryBuilder()
            .insert()
            .into(CourseDetails)
            .values(course)
            .returning('*')
            .execute()

        const saveCourse = saveResult.generatedMaps[0]

        return CourseDetails.createCourse(saveCourse.lecture, saveCourse.student, saveCourse.registDate)
    }

    public async findById(course: CourseDetails): Promise<CourseDetails | undefined> {
        return await createQueryBuilder()
            .select(['CourseDetails.registDate',])
            .from(CourseDetails, 'CourseDetails')
            .where('CourseDetails.lecture = :lectureId and CourseDetails.student = :studentId', { lectureId: course.lecture.id, studentId: course.student.id })
            .getOne()
    }
}