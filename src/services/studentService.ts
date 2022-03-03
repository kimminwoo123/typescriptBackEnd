import { Router, Response, Request, NextFunction } from "express"
import { Service } from "typedi"
import db from '../../db/pg'
import { StudentsRepository } from '../repositories/studentsRepository'
import { LecturesRepository } from '../repositories/lecturesRepository'
import { CourseDetailsRepository } from '../repositories/courseDetailsRepository'

import { Students } from '../domains/students'
import { Lectures } from '../domains/lectures'
import { CourseDetails } from '../domains/courseDetails'

@Service()
export class StudentService {
        constructor(
                private readonly studentRepository: StudentsRepository,
                private readonly lecturesRepository: LecturesRepository,
                private readonly courseDetailsRepository: CourseDetailsRepository,
        ) { }

        /**
         * 수강생 가입 new
         * 
         */
        public async studentRegistration(student: Students): Promise<Students> {
                const checkEmailStudent: Students | undefined = await this.checkEmailStudent(student.studentEmail)

                if (checkEmailStudent != null) {
                        throw new Error('email 중복')
                } else {
                        this.studentRepository.save(student)
                        return student
                }
        }

        /**
         * 수강생 탈퇴 new
         * 
         */
        public async studentWithdrawal(student: Students): Promise<Students> {
                const studentIdCheck: Students | undefined = await this.checkIdStudent(student.id)

                if (studentIdCheck == null) {
                        throw new Error('존재하지 않는 id입니다')
                } else {
                        await this.studentRepository.delete(student.id)
                        return student
                }
        }

        /**
         * 수강생 강의신청 new
         * 
         */
        public async lectureRegistration(student: Students, lecture: Lectures) {
                const studentIdCheck: Students | undefined = await this.checkIdStudent(student.id)
                const lectureIdCheck: Lectures | undefined = await this.checkIdLecture(lecture.id)

                if (studentIdCheck == null) {
                        throw new Error('존재하지 않는 학생 id입니다')
                }

                if (lectureIdCheck == null) {
                        throw new Error('존재하지 않는 강의 id입니다')
                }

                const course: CourseDetails = CourseDetails.createCourse(lecture, student)
                const courseCheck = await this.courseDetailsRepository.findOne(course)

                if (courseCheck != null) {
                        throw new Error('이미 강의신청이 되어 있습니다.')
                }

                await this.courseDetailsRepository.save(course)
        }

        private async checkEmailStudent(email: Students['studentEmail']): Promise<Students | undefined> {
                return await this.studentRepository.findByEmail(email)
        }

        private async checkIdStudent(id: Students['id']): Promise<Students | undefined> {
                return await this.studentRepository.findOne(id)
        }

        private async checkIdLecture(id: Lectures['id']): Promise<Lectures | undefined> {
                return await this.lecturesRepository.findOne(id)
        }

        // /**
        // * 학생 id 확인
        // * 
        // */
        // public async checkId(id: string) {
        //         try {
        //                 const query = `
        //                 select *
        //                 from students
        //                 where student_id = '${id}';
        //               `

        //                 const result = await db.query(query)

        //                 if (!result.rows.length) {
        //                         return true
        //                 } else {
        //                         return false
        //                 }
        //         } catch (error) {
        //                 console.log(error)
        //                 throw Error
        //         }
        // }

        // /**
        //  * 학생 id, eamil 확인
        //  * 
        //  */
        // public async checkIdEmail(id: string, email: string) {
        //         try {
        //                 const query = `
        //                         select *
        //                         from students
        //                         where student_id = '${id}' or email = '${email}';
        //                       `

        //                 const result = await db.query(query)

        //                 // 학생 id, eamil 체크
        //                 const studentIdEmailCheck = result.rows.some((v) => v.student_id === id || v.email === email)

        //                 if (!studentIdEmailCheck) { // 중복이 아닐때
        //                         return true
        //                 } else {
        //                         return false
        //                 }
        //         } catch (error) {
        //                 console.log(error)
        //                 throw Error
        //         }

        // }

        // /**
        // * 강의id, 학생id 확인
        // * 
        // */
        // public async checkCourese(lectureIdList: Array<string>, studnetIdList: Array<string>, req: Request) {
        //         try {
        //                 const query = `
        //                         select array_agg(lecture_id) as lecture_id ,
        //                                 (select array_agg(student_id) as student_id
        //                                 from students
        //                                 where student_id in ('${studnetIdList.join(`','`)}'))
        //                         from lectures
        //                         where open_flag = true 
        //                         and lecture_id in ('${lectureIdList.join(`','`)}');
        //                       `
        //                 const result = await db.query(query)

        //                 // req데이터에서 가입된 수강생과 강의신청 가능한 강의 추출
        //                 const filterResult = req.body.data?.filter((v: any) => result.rows[0].lecture_id.includes(v.lecture_id) && result.rows[0].student_id.includes(v.student_id))
        //                 return filterResult
        //         } catch (error) {
        //                 console.log(error)
        //                 throw Error
        //         }
        // }

        // /**
        // * 수강신청
        // * 
        // */
        // public async reqCourese(filterList: Array<any>) {
        //         try {
        //                 const insertFormat = filterList.map(v => `('${v.lecture_id}','${v.student_id}')`)

        //                 const query = `
        //                         INSERT INTO course_details (lecture_id, student_id)
        //                         VALUES 
        //                         ${insertFormat}
        //                         RETURNING * ;
        //                               `

        //                 const result = await db.query(query)
        //                 return result.rows
        //         } catch (error) {
        //                 console.log(error)
        //                 throw Error
        //         }
        // }

        // /**
        //  * 수강생 가입
        //  * 
        //  */
        // public async createStudent(id: string, studentName: string, email: string) {
        //         try {
        //                 const query = `
        //                         INSERT INTO students
        //                         (student_id, email, student_name, regist_date)
        //                         VALUES('${id}', '${email}', '${studentName}', current_date)
        //                         RETURNING * ;
        //                         `

        //                 const result = await db.query(query)

        //                 return result.rowCount
        //         } catch (error) {
        //                 console.log(error)
        //                 throw Error
        //         }

        // }

        // /**
        //  * 수강생 탈퇴
        //  * 
        //  */
        // public async deleteStudent(student_id: string) {
        //         try {
        //                 const courseQuery = `
        //                         delete from course_details where student_id = '${student_id}';
        //                         `
        //                 const studentQuery = `
        //                         delete from students where student_id = '${student_id}';
        //                         `

        //                 await db.query(courseQuery)
        //                 const studentResult = await db.query(studentQuery)

        //                 if (studentResult.rowCount) {
        //                         return true
        //                 } else {
        //                         return false
        //                 }
        //         } catch (error) {
        //                 console.log(error)
        //                 throw Error
        //         }
        // }
}