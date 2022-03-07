import { Router, Response, Request, NextFunction } from "express"
import { LecturesRepository } from '../repositories/lecturesRepository'
import { LectureRequest } from '../dto/lectureRequest'
import { Lectures } from '../domains/lectures'
import db from '../../db/pg'
import { Instructors } from "../domains/instructors"
import { InstructorsRepository } from '../repositories/instructorsRepository'


export class LectureService {
        constructor(
                private readonly lecturesRepository: LecturesRepository,
                private readonly instructorsRepository: InstructorsRepository
        ) { }

        /**
         * 강의 목록들을 조회한다.
         * 
         */
        public async searchCondition(lectureRequest: LectureRequest): Promise<LectureListResult[]> {
                return await this.lecturesRepository.findConditionSearch(lectureRequest)
        }

        /**
         * 강의 목록 상세조회 한다.
         * 
         */
        public async searchDetail(id: Lectures['id']): Promise<Lectures> {
                const checkId = await this.lecturesRepository.findById(id)
                if (checkId == null) {
                        throw new Error('잘못된 강의 id 입니다.')
                }

                const searchResult = await this.lecturesRepository.findDetailSearch(id)
                if (searchResult == null) {
                        throw new Error('오픈 되지 않은 강의 입니다.')
                }

                return searchResult
        }

        /**
         * 강의 등록
         * 
         */
        public async create(instructor: Instructors, lectureList: Lectures[]): Promise<Lectures[]> {
                const checkId = await this.instructorsRepository.findById(instructor.id)
                if (checkId == null) {
                        throw new Error('잘못된 강사 id입니다.')
                }

                const filterLecture: Lectures[] = []
                for (const lecture of lectureList) {
                        const checkName = await this.lecturesRepository.findByName(lecture.lectureName)
                        if (checkName == null) {
                                filterLecture.push(lecture)
                        }
                }

                return await this.lecturesRepository.saveLectures(filterLecture)
        }

        /**
         * 강의 수정
         * 
         */
        public async update(instructor: Instructors, lecture: Lectures): Promise<Lectures> {
                const checkId = await this.instructorsRepository.findByIdAndJoin(instructor.id)
                if (checkId == null) {
                        throw new Error('잘못된 강사 id입니다.')
                }

                const checkLectureId = checkId?.lectures?.filter(v => v.id === Number(lecture.id))
                if (checkLectureId?.length === 0) {
                        throw new Error('잘못된 강의 id입니다.')
                }

                return await this.lecturesRepository.updateLecture(lecture)
        }

        /**
         * 강의 삭제
         * 
         */
        public async delete(instructor: Instructors, lecture: Lectures): Promise<Lectures> {
                const checkId = await this.instructorsRepository.findByIdAndJoin(instructor.id)
                if (checkId == null) {
                        throw new Error('잘못된 강사 id입니다.')
                }

                const checkLectureId = checkId?.lectures?.filter(v => v.id === Number(lecture.id))
                if (checkLectureId?.length === 0) {
                        throw new Error('잘못된 강의 id입니다.')
                } else if (checkLectureId?.find(v => Number(v.studentCount) > 0) != null) {
                        throw new Error('수강중인 학생이 있습니다.')
                }

                return await this.lecturesRepository.deleteLecture(lecture)
        }
}