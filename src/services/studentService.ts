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

                const course: CourseDetails = CourseDetails.createCourse(lecture, student, new Date())
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
}