import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm"
import { CourseDetails } from './courseDetails'

@Entity()
export class Students extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: number

    @Column({
        type: 'text',
        nullable: false,
    })
    studentName: String

    @Column({
        type: 'text',
        nullable: false,
        unique: true,
    })
    studentEmail: String

    @Column({
        type: 'timestamptz',
        nullable: false,
    })
    registDate: Date

    @OneToMany(() => CourseDetails, courseDetail => courseDetail.student)
    courseDetail: CourseDetails[]
}