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
}