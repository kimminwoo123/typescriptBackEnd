import { LecturesRepository } from '../repositories/lecturesRepository'
import { LectureRequest } from '../dto/lectureRequest'
import { Lectures } from '../entities/lectures'
import { Instructors } from "../entities/instructors"
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
                const lecture = await this.lecturesRepository.findById(id)
                if (lecture == null) {
                        throw new Error('잘못된 강의 id 입니다.')
                }

                const lectureSearchResult = await this.lecturesRepository.findDetailSearch(id)
                if (lectureSearchResult == null) {
                        throw new Error('오픈 되지 않은 강의 입니다.')
                }

                return lectureSearchResult
        }

        /**
         * 강의 등록
         * 
         */
        public async create(instructor: Instructors, lectureList: Lectures[]): Promise<Lectures[]> {
                await this.validationInstructorId(instructor)
                const filteredLecture: Lectures[] = await this.validationLectureName(lectureList)
                return await this.lecturesRepository.saveLectures(filteredLecture)
        }

        /**
         * 강의 수정
         * 
         */
        public async update(instructor: Instructors, lecture: Lectures): Promise<Lectures> {
                const instructorAndLecture = await this.validationInstructorId(instructor)
                const lectureList = this.filteredLecture(instructorAndLecture, lecture)
                this.validationLectureId(lectureList)
                return await this.lecturesRepository.updateLecture(lecture)
        }

        /**
         * 강의 삭제
         * 
         */
        public async delete(instructor: Instructors, lecture: Lectures): Promise<Lectures> {
                const instructorAndLecture = await this.validationInstructorId(instructor)
                const lectureList = this.filteredLecture(instructorAndLecture, lecture)
                this.validationLectureId(lectureList)
                this.validationStudentCount(lectureList)
                return await this.lecturesRepository.deleteLecture(lecture)
        }

        private async validationInstructorId(instructor: Instructors): Promise<Instructors> {
                const result = await this.instructorsRepository.findByIdAndJoin(instructor.id)
                if (result == null) {
                        throw new Error('잘못된 강사 id입니다.')
                }

                return result
        }

        private filteredLecture(instructorAndLecture: Instructors, lecture: Lectures): Lectures[] {
                return instructorAndLecture.lectures?.filter(v => v.id === Number(lecture.id))
        }

        private validationLectureId(lectureList: Lectures[]): void {
                if (lectureList?.length === 0) {
                        throw new Error('잘못된 강의 id입니다.')
                }
        }

        private validationStudentCount(lectureList: Lectures[]): void {
                if (lectureList?.find(v => Number(v.studentCount) > 0) != null) {
                        throw new Error('수강중인 학생이 있습니다.')
                }
        }

        private async validationLectureName(lectureList: Lectures[]): Promise<Lectures[]> {
                let result: Lectures[] = []
                for (const lecture of lectureList) {
                        const finedLecture = await this.lecturesRepository.findByName(lecture.lectureName)
                        if (this.lectureDuplicateCheck(finedLecture)) {
                                result.push(lecture)
                        }
                }
                return result
        }

        private lectureDuplicateCheck(finedLecture: Lectures | undefined): boolean {
                return finedLecture == null
        }
}