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

    public async findAll() {
        // const result = await this.manager.find(Lectures, { relations: ['instructors'] })  // await this.manager.createQueryBuilder().select().from(Instructors, 'Instructors').getRawMany()


        return await this.manager.createQueryBuilder()
            .select(['i.id "instructorsId"',
                'i.instructor_name "instructorName"',
                'l.category "category"',
                'l.lecture_introduction "lectureIntroduction"',
                'l.lecture_price "lecturePrice"',
                'l.student_count "studentCount"',
                'l.lecture_create_date "lectureCreateDate"'])
            .from(Lectures, 'l')
            .innerJoin('l.instructors', 'i')
            .orderBy('student_count', 'DESC')
            .skip(0)
            .take(3)
            .getRawMany()
    }

    // public async delete(student: Students): Promise<void> {
    //     await this.em.delete(Students, { id: student.id })
    // }

    public async findCondition(lectureCondition: LectureCondition) {
        const offset = (lectureCondition.page - 1) * lectureCondition.pageLength
        const limit = lectureCondition.page * lectureCondition.pageLength

        const lectureSearchList = await this.manager.query(
            `
            with base as (
                select  l.id ,
                        l.category ,
                        l.lecture_name ,
                        i.instructor_name ,
                        l.lecture_price ,
                        l.student_count ,
                        l.lecture_create_date,
                        cd.student_id 
                from lectures l join instructors i 
                                on l.instructors_id = i.id
                        left join course_details cd 
                                on cd.lecture_id = l.id
                        where 1 = 1 and category = $1
                                and open_flag = true
                                and (i.instructor_name = $2
                                or l.lecture_name = $2)
                        )
                select * 
                from (
                    select category, instructor_name, lecture_price, student_count, lecture_create_date, lecture_name
                    from (
                            select base.category , base.id , base.instructor_name, base.lecture_price, base.student_count, base.lecture_create_date, base.lecture_name,
                                    row_number() over(partition by base.id order by base.lecture_create_date desc) as rank
                            from base 
                            ) base2
                    where base2.rank = 1
                    order by $3 desc 
                        ) base3
                offset $4
                limit $5
                ;`
            , [lectureCondition.category,
            lectureCondition.search,
            lectureCondition.sortCondition,
                offset,
                limit])

    }
}
