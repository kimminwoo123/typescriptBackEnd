import { createQueryBuilder, EntityRepository, Repository } from 'typeorm'
import { Lectures } from '../domains/lectures'
import { LectureRequest } from '../dto/lectureRequest'

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

        public async findLectureDetail() {

        }
}
