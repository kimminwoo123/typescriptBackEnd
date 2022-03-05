import { createQueryBuilder, EntityRepository, Repository } from 'typeorm'
import { Lectures } from '../domains/lectures'
import { LectureRequest } from '../dto/lectureRequest'

@EntityRepository(Lectures)
export class LecturesRepository extends Repository<Lectures> {
        constructor() {
                super()
        }

        public async findById(id: Lectures['id']): Promise<Lectures | undefined> {
                return await createQueryBuilder(Lectures, 'l')
                        .where('l.id = :id', { id })
                        .getOne()
        }

        public async findConditionSearch(lectureRequest: LectureRequest): Promise<LectureListResult[]> {
                const queryBuilder = await createQueryBuilder()
                        .select(['i.instructor_name "instructorName"',
                                'l.id id',
                                'l.lecture_name "lectureName"',
                                'l.category "category"',
                                'l.lecture_introduction "lectureIntroduction"',
                                'l.lecture_price "lecturePrice"',
                                'l.student_count "studentCount"',
                                'l.lecture_create_date "lectureCreateDate"'])
                        .from(Lectures, 'l')
                        .innerJoin('l.instructors', 'i')
                        .where('l.open_flag = true')
                        .andWhere('l.category = :category', { category: lectureRequest.getCategory() })
                        .andWhere('(i.instructor_name = :search or l.lecture_name = :search )', { search: lectureRequest.getSearchWord() })
                        .offset(lectureRequest.getOffset())
                        .limit(lectureRequest.getLimit())

                if (lectureRequest.getSortCondition() === 'studentCount') {
                        queryBuilder.orderBy('student_count', 'DESC')
                } else {
                        queryBuilder.orderBy('lecture_create_date', 'DESC')
                }

                return await queryBuilder.getRawMany()
        }

        public async findDetailSearch(id: Lectures['id']): Promise<Lectures | undefined> {
                const queryBuilder = await createQueryBuilder(Lectures, 'l')
                        .leftJoinAndSelect('l.courseDetail', 'cd')
                        .leftJoinAndSelect('cd.student', 's')
                        .where('l.open_flag = true')
                        .andWhere('l.id =:id', { id })
                        .getOne()

                return queryBuilder
        }

}
