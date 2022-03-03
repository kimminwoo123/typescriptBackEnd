import { createQueryBuilder, EntityRepository, Repository } from 'typeorm'
import { Lectures } from '../domains/lectures'

@EntityRepository(Lectures)
export class LecturesRepository extends Repository<Lectures> {
        constructor() {
                super()
        }

        public async findById(id: Lectures['id']): Promise<Lectures | undefined> {
                try {
                        return await createQueryBuilder()
                                .select(['Lectures.id',
                                        'Lectures.lectureName',
                                        'Lectures.category',
                                        'Lectures.lectureIntroduction',
                                        'Lectures.lecturePrice',
                                        'Lectures.studentCount',
                                        'Lectures.openFlag',
                                        'Lectures.lectureCreateDate',
                                        'Lectures.lectureModifyDate',])
                                .from(Lectures, 'Lectures')
                                .where('Lectures.id = :id', { id })
                                .getOne()
                } catch (error) {
                        console.log(error)
                        throw new Error('LecturesRepository findById 오류')
                }
        }

        public async findConditionLecture(lectureCondition: LectureCondition): Promise<LectureListResult[]> {
                const offset: number = (lectureCondition.page - 1) * lectureCondition.pageLength
                const limit: number = lectureCondition.page * lectureCondition.pageLength

                return await this.manager.createQueryBuilder()
                        .select(['i.instructor_name "instructorName"',
                                'l.id id',
                                'l.category "category"',
                                'l.lecture_introduction "lectureIntroduction"',
                                'l.lecture_price "lecturePrice"',
                                'l.student_count "studentCount"',
                                'l.lecture_create_date "lectureCreateDate"'])
                        .from(Lectures, 'l')
                        .innerJoin('l.instructors', 'i')
                        .where('l.open_flag = true')
                        .andWhere('l.category = :category', { category: lectureCondition.category })
                        .andWhere('(i.instructor_name = :search or l.lecture_name = :search )', { search: lectureCondition.search })
                        .orderBy(`${lectureCondition.sortCondition === 'studentCount' ? 'student_count' : 'lecture_create_date'}`, 'DESC')
                        .offset(offset)
                        .limit(limit)
                        .getRawMany()
        }

        public async findLectureDetail() {

        }
}
