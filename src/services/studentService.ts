import { Router, Response, Request, NextFunction } from "express"
import { StudentsRepository } from '../repositories/studentsRepository'
import { LecturesRepository } from '../repositories/lecturesRepository'
import { CourseDetailsRepository } from '../repositories/courseDetailsRepository'

import { Students } from '../domains/students'
import { Lectures } from '../domains/lectures'
import { CourseDetails } from '../domains/courseDetails'

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

                if (checkEmailStudent == null) {
                        return await this.studentRepository.saveByStudent(student)
                } else {
                        throw new Error('email 중복')
                }
        }

        /**
         * 수강생 탈퇴 new
         * 
         */
        public async studentWithdrawal(student: Students): Promise<Students> {
                const checkStudent: Students | undefined = await this.checkEmailStudent(student.studentEmail)

                if (checkStudent == null) {
                        throw new Error('존재하지 않는 id입니다')
                } else {
                        return await this.studentRepository.deleteById(checkStudent.id)
                }
        }

        /**
         * 수강생 강의신청 new
         * 
         */
        public async lectureRegistration(student: Students, lecture: Lectures): Promise<CourseDetails> {
                const studentCheck: Students | undefined = await this.checkIdStudent(student.id)
                const lectureCheck: Lectures | undefined = await this.checkIdLecture(lecture.id)

                if (studentCheck == null) {
                        throw new Error('존재하지 않는 학생 id입니다')
                }

                if (lectureCheck == null) {
                        throw new Error('존재하지 않는 강의 id입니다')
                }

                // 강의오픈 false일때
                if (lectureCheck.openFlag === false) {
                        throw new Error('신청할 수 없는 강의입니다')
                }

                const course: CourseDetails = CourseDetails.createCourse(lecture, student, new Date())
                const courseCheck = await this.courseDetailsRepository.findById(course)

                if (courseCheck != null) {
                        throw new Error('이미 강의신청이 되어 있습니다')
                }

                return await this.courseDetailsRepository.saveByCourse(course)
        }

        private async checkEmailStudent(email: Students['studentEmail']): Promise<Students | undefined> {
                try {
                        return await this.studentRepository.findByEmail(email)
                } catch (error) {
                        console.log(error)
                        throw new Error('StudentService checkEmailStudent 오류')
                }
        }

        private async checkIdStudent(id: Students['id']): Promise<Students | undefined> {
                try {
                        return await this.studentRepository.findById(id)
                } catch (error) {
                        console.log(error)
                        throw new Error('StudentService checkIdStudent 오류')
                }
        }

        private async checkIdLecture(id: Lectures['id']): Promise<Lectures | undefined> {
                try {
                        return await this.lecturesRepository.findById(id)
                } catch (error) {
                        console.log(error)
                        throw new Error('StudentService checkIdLecture 오류')
                }
        }
}