import { Repository, EntityRepository, createQueryBuilder } from 'typeorm'
import { CourseDetails } from '../domains/courseDetails'

@EntityRepository(CourseDetails)
export class CourseDetailsRepository extends Repository<CourseDetails> {
    constructor() {
        super()
    }

    public async saveByCourse(course: CourseDetails): Promise<CourseDetails> {
        try {
            const saveResult = await createQueryBuilder()
                .insert()
                .into(CourseDetails)
                .values(course)
                .returning('*')
                .execute()

            const saveCourse = saveResult.generatedMaps[0]

            return CourseDetails.createCourse(saveCourse.lecture, saveCourse.student, saveCourse.registDate)
        } catch (error) {
            console.log(error)
            throw new Error('StudentsRepository saveStudent 오류')
        }
    }

    public async findById(course: CourseDetails): Promise<CourseDetails | undefined> {
        try {
            return await createQueryBuilder()
                .select(['CourseDetails.registDate',])
                .from(CourseDetails, 'CourseDetails')
                .where('CourseDetails.lecture = :lectureId and CourseDetails.student = :studentId', { lectureId: course.lecture.id, studentId: course.student.id })
                .getOne()
        } catch (error) {
            console.log(error)
            throw new Error('CourseDetailsRepository findById 오류')
        }
    }

    // public async delete(id: Students['id']): Promise<void> {
    //     await this.manager.delete(Students, { id })
    // }
}