import { EntityManager, EntityRepository, AbstractRepository } from 'typeorm'
import { Lectures } from '../domains/lectures'

@EntityRepository(Lectures)
export class LecutresRepository extends AbstractRepository<Lectures> {
        // public async save(student: Students): Promise<void> {
        //     await this.em.save(student)
        // }

        // public async findOne(student: Students): Promise<Students | undefined> {
        //     return await this.em.findOne(Students, { id: student.id })
        // }

        public async findOne(id: Lectures['id']): Promise<Lectures | undefined> {
                return await this.manager.findOne(Lectures)
        }

        public async findConditionLecture(lecturecondition: LectureCondition): Promise<LectureListResult[]> {
                const offset: number = (lecturecondition.page - 1) * lecturecondition.pageLength
                const limit: number = lecturecondition.page * lecturecondition.pageLength

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
                        .andWhere('l.category = :category', { category: lecturecondition.category })
                        .andWhere('(i.instructor_name = :search or l.lecture_name = :search )', { search: lecturecondition.search })
                        .orderBy(`${lecturecondition.sortCondition === 'studentCount' ? 'student_count' : 'lecture_create_date'}`, 'DESC')
                        .offset(offset)
                        .limit(limit)
                        .getRawMany()
        }

        public async findLecutreDetail() {

        }
}
