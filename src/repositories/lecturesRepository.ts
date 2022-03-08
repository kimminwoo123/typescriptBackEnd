import { createQueryBuilder, EntityRepository, Repository } from 'typeorm'
import { Lectures } from '../entities/lectures'
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

        public async findByName(name: Lectures['lectureName']): Promise<Lectures | undefined> {
                return await createQueryBuilder(Lectures, 'l')
                        .where('l.lectureName = :name', { name })
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

        public async saveLectures(lectureList: Lectures[]): Promise<Lectures[]> {
                const saveResult = await createQueryBuilder(Lectures)
                        .insert()
                        .into(Lectures)
                        .values(lectureList)
                        .returning('*')
                        .execute()

                const saveLectures = saveResult.generatedMaps.map(v =>
                        Lectures.createLecture(v.id,
                                v.lectureName,
                                v.category,
                                v.lecturePrice,
                                v.studentCount,
                                v.openFlag,
                                v.lectureCreateDate,
                                v.lectureModifyDate,
                                v.lectureIntroduction
                        )
                )

                return saveLectures
        }

        public async updateLecture(lecture: Lectures): Promise<Lectures> {
                const updateResult = await createQueryBuilder()
                        .update(Lectures, lecture)
                        .whereEntity(lecture)
                        .where("id = :id", { id: lecture.id })
                        .updateEntity(true)
                        .returning('*')
                        .execute()

                const result = updateResult.generatedMaps[0]

                return Lectures.createLecture(result.id,
                        result.lectureName,
                        result.category,
                        result.lecturePrice,
                        result.studentCount,
                        result.openFlag,
                        result.lectureCreateDate,
                        result.lectureModifyDate,
                        result.lectureIntroduction)
        }

        public async deleteLecture(lecture: Lectures): Promise<Lectures> {
                const deleteResult = await createQueryBuilder()
                        .delete()
                        .from(Lectures)
                        .where('id = :id', { id: lecture.id })
                        .returning('*')
                        .execute()

                const deleteLecture = deleteResult.raw[0]

                return Lectures.createLecture(deleteLecture.id,
                        deleteLecture.lecture_name,
                        deleteLecture.category,
                        deleteLecture.lecture_price,
                        deleteLecture.student_count,
                        deleteLecture.open_flag,
                        deleteLecture.lecture_create_date,
                        deleteLecture.lecture_modify_date)
        }
}
