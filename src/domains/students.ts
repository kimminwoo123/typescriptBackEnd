import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm"
import { CourseDetails } from './courseDetails'

@Entity()
export class Students extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: StudentDto['id']

    @Column({
        type: 'text',
        nullable: false,
    })
    studentName: StudentDto['studentName']

    @Column({
        type: 'text',
        nullable: false,
        unique: true,
    })
    studentEmail: StudentDto['studentEmail']

    @Column({
        type: 'timestamptz',
        nullable: false,
    })
    registDate: StudentDto['registDate']

    @OneToMany(() => CourseDetails, courseDetail => courseDetail.student)
    courseDetail: CourseDetails[]

    public static createStudent(name: Students['studentName'], email: Students['studentEmail']): Students {
        const student = new Students()
        student.studentName = name
        student.studentEmail = email
        student.registDate = new Date()

        return student
    }
}