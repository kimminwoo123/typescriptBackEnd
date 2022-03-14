import { Entity, Column, ManyToOne } from "typeorm"
import { Lectures } from './lectures'
import { Students } from './students'

@Entity()
export class CourseDetails {
    @ManyToOne(() => Lectures, lecture => lecture.id, { primary: true })
    lecture: Lectures

    @ManyToOne(() => Students, student => student.id, { primary: true })
    student: Students

    @Column({
        type: 'timestamptz',
        nullable: false,
    })
    registDate?: CourseDetailDto['registDate']

    public static createCourse(lecture: Lectures, student: Students, date: CourseDetails['registDate']): CourseDetails {
        const courseDetail = new CourseDetails()
        courseDetail.lecture = lecture
        courseDetail.student = student
        courseDetail.registDate = date

        return courseDetail
    }
}