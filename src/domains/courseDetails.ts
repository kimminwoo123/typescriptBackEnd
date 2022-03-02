import { Entity, Column, BaseEntity, ManyToOne } from "typeorm"
import { Lectures } from './lectures'
import { Students } from './students'

@Entity()
export class CourseDetails extends BaseEntity {
    @ManyToOne(() => Lectures, lecture => lecture.id, { primary: true })
    private lecture: Lectures

    @ManyToOne(() => Students, stduent => stduent.id, { primary: true })
    private student: Students

    @Column({
        type: 'timestamptz',
        nullable: false,
    })
    private registDate?: CourseDetailDto['registDate']

    public static createCourse(lecutre: Lectures, student: Students): CourseDetails {
        const courseDetail = new CourseDetails()
        courseDetail.lecture = lecutre
        courseDetail.student = student
        courseDetail.registDate = new Date()

        return courseDetail
    }
}