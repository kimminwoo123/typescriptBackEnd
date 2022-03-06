import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, } from "typeorm"
import { Lectures } from './lectures'

@Entity()
export class Instructors extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: InstructorDto['id']

    @Column({
        type: 'text',
        nullable: false,
    })
    instructorName: InstructorDto['instructorName']

    @Column({
        type: 'timestamptz',
        nullable: false,
    })
    registDate?: InstructorDto['registDate']

    @OneToMany(() => Lectures, lecture => lecture.instructors)
    lectures: Lectures[]

    public static createInstructor(
        id?: Instructors['id'],
        instructorName?: Instructors['instructorName'],
        registDate?: Instructors['registDate'],
        lecture?: Instructors['lectures']
    ): Instructors {
        const instructors = new Instructors()
        id != null ? instructors.id = id : null
        instructorName != null ? instructors.instructorName = instructorName : null
        registDate != null ? instructors.registDate = registDate : null
        lecture != null ? instructors.lectures = lecture : null

        return instructors
    }
}