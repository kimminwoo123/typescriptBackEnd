import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne } from "typeorm"
import { Lectures } from './lectures'

@Entity()
export class Instructors extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: number

    @Column({
        type: 'text',
        nullable: false,
    })
    instructorName: String

    @Column({
        type: 'timestamptz',
        nullable: false,
    })
    registDate: Date

    @OneToMany(() => Lectures, lecture => lecture.instructors)
    lectures: Lectures[]
}