import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"

@Entity()
export class Lectures extends BaseEntity {
    @PrimaryGeneratedColumn()
    lectureId: number

    @Column()
    lectureName: Text

    @Column()
    category: Text

    @Column()
    lectureIntroduction: Text

    @Column()
    lecturePrice: number

    @Column()
    studentCount: number

    @Column()
    openFlag: Boolean

    @Column()
    lectureCreateDate: Date

    @Column()
    lectureModifyDate: Date

    @Column()
    instructorId: Text
}