// import { Entity, PrimaryColumn, Column, BaseEntity, ManyToOne } from "typeorm"
// import { Lectures } from './lectures'
// import { Students } from './students'

// @Entity()
// export class CourseDetails extends BaseEntity {
//     @PrimaryColumn()
//     @ManyToOne(() => Lectures, lecture => lecture.courseDetails)
//     lectures: Lectures

//     @PrimaryColumn()
//     @ManyToOne(() => Students, stduent => stduent.courseDetails)
//     student: Students

//     @Column({
//         type: 'timestamptz',
//         nullable: false,
//     })
//     registDate: Date
// }