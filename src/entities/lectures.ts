import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from 'typeorm'
import { Instructors } from './instructors'
// import { CourseDetails } from './courseDetails'

@Entity()
export class Lectures extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
    })
    lectureId: number

    @Column({
        type: 'text',
        nullable: false,
        unique: true,
    })
    lectureName: String

    @Column({
        type: 'text',
        nullable: false,
        // enum: []
    })
    category: Category

    @Column({
        type: 'text',
        nullable: true,
    })
    lectureIntroduction: String

    @Column({
        type: 'int',
        nullable: false,
    })
    lecturePrice: number

    @Column({
        type: 'int',
        nullable: false,
    })
    studentCount: number

    @Column({
        type: 'boolean',
        nullable: false,
    })
    openFlag: Boolean

    @Column({
        type: 'timestamptz',
        nullable: false,
    })
    lectureCreateDate: Date

    @Column({
        type: 'timestamptz',
        nullable: true,
    })
    lectureModifyDate: Date

    @ManyToOne((type) => Instructors, instructor => instructor.lectures)
    instructors: Instructors

    // @OneToMany(() => CourseDetails, courseDetail => courseDetail.lectures)
    // courseDetails: CourseDetails[]
}