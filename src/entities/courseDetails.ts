import { Entity, Column, BaseEntity, ManyToOne } from "typeorm"
import { Lectures } from './lectures'
import { Students } from './students'

@Entity()
export class CourseDetails extends BaseEntity {
    @ManyToOne(() => Lectures, lecture => lecture.id, { primary: true })
    lecture: Lectures

    @ManyToOne(() => Students, stduent => stduent.id, { primary: true })
    student: Students

    @Column({
        type: 'timestamptz',
        nullable: false,
    })
    registDate: Date
}