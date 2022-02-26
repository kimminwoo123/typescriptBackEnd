import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"

@Entity()
export class Instructors extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
    })
    instructorId: number

    @Column({
        type: 'text',
        nullable: false,
        unique: true,
    })
    instructorName: string

    @Column({
        type: 'timestamptz',
        nullable: false,
    })
    registDate: Date
}