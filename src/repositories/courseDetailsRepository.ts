import { AbstractRepository, EntityRepository } from 'typeorm'
import { CourseDetails } from '../domains/courseDetails'

@EntityRepository(CourseDetails)
export class CourseDetailsRepository extends AbstractRepository<CourseDetails> {

    public async save(course: CourseDetails): Promise<CourseDetails> {
        return await this.manager.save(course)
    }

    public async findOne(course: CourseDetails): Promise<CourseDetails | undefined> {
        return await this.manager.findOne(CourseDetails, { lecture: course.lecture, student: course.student })
    }

    // public async delete(id: Students['id']): Promise<void> {
    //     await this.manager.delete(Students, { id })
    // }
}