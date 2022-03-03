import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from 'typeorm'
import { Instructors } from './instructors'
import { CourseDetails } from './courseDetails'

@Entity()
export class Lectures extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: LectureDto['id']

    @Column({
        type: 'text',
        nullable: false,
        unique: true,
    })
    lectureName: LectureDto['lectureName']

    @Column({
        type: 'text',
        nullable: false,
        // enum: []
    })
    category: LectureDto['category']

    @Column({
        type: 'text',
        nullable: true,
    })
    lectureIntroduction?: LectureDto['lectureIntroduction']

    @Column({
        type: 'int',
        nullable: false,
    })
    lecturePrice: LectureDto['lecturePrice']

    @Column({
        type: 'int',
        nullable: false,
    })
    studentCount: LectureDto['studentCount']

    @Column({
        type: 'boolean',
        nullable: false,
    })
    openFlag: LectureDto['openFlag']

    @Column({
        type: 'timestamptz',
        nullable: false,
    })
    lectureCreateDate: LectureDto['lectureCreateDate']

    @Column({
        type: 'timestamptz',
        nullable: true,
    })
    lectureModifyDate?: LectureDto['lectureModifyDate']

    @OneToMany(() => CourseDetails, courseDetail => courseDetail.lecture)
    courseDetail: CourseDetails[]

    @ManyToOne(() => Instructors, instructor => instructor.lectures)
    instructors: Instructors

    public static createLecture(
        id?: Lectures['id'],
        name?: Lectures['lectureName'],
        category?: Lectures['category'],
        lecturePrice?: Lectures['lecturePrice'],
        studentCount?: Lectures['studentCount'],
        openFlag?: Lectures['openFlag'],
        lectureCreateDate?: Lectures['lectureCreateDate'],
        lectureModifyDate?: Lectures['lectureModifyDate'],
        lectureIntroduction?: Lectures['lectureIntroduction'],
    ): Lectures {
        const lecture = new Lectures()
        id != null ? lecture.id = id : null
        name != null ? lecture.lectureName = name : null
        category != null ? lecture.category = category : null
        lecturePrice != null ? lecture.lecturePrice = lecturePrice : null
        studentCount != null ? lecture.studentCount = studentCount : null
        openFlag != null ? lecture.openFlag = openFlag : null
        lectureCreateDate != null ? lecture.lectureCreateDate = lectureCreateDate : null
        lectureModifyDate != null ? lecture.lectureModifyDate = lectureModifyDate : null
        lectureIntroduction != null ? lecture.lectureIntroduction = lectureIntroduction : null

        return lecture
    }
}