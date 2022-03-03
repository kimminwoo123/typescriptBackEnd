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

    public static createStudent(id?: Students['id'], name?: Students['studentName'], email?: Students['studentEmail'], date?: Students['registDate']): Students {
        const student = new Students()
        id != null ? student.id = id : null
        name != null ? student.studentName = name : null
        email != null ? student.studentEmail = email : null
        date != null ? student.registDate = date : null

        return student
    }
}