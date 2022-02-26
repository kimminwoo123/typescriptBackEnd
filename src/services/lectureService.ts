import { Router, Response, Request, NextFunction } from "express"
import { Service } from "typedi"
import db from '../../db/pg'

@Service()
export class LectureService {
        constructor() { }

        /**
         * 강의 목록들을 조회한다.
         * 
         */
        public async lectureList(search: string, page: number, sort: string, category: string) {
                try {
                        const pageLength = 3 // 한페이지당 row 수

                        const query = `
                                with base as (
                                select  l.lecture_id ,
                                        l.category ,
                                        l.lecture_name ,
                                        i.instructor_name ,
                                        l.lecture_price ,
                                        l.student_count ,
                                        l.lecture_create_date,
                                        cd.student_id 
                                from lectures l join instructors i 
                                                on l.instructor_id = i.instructor_id
                                        left join course_details cd 
                                                on cd.lecture_id = l.lecture_id
                                        where 1 = 1 ${category === 'all' ? '' : `and category = '${category}'`}
                                                and open_flag = true
                                                and (i.instructor_name = '${search}'
                                                or l.lecture_name = '${search}'
                                                or cd.student_id = '${search}')
                                        )
                                select * 
                                from (
                                select category, lecture_id, instructor_name, lecture_price, student_count, lecture_create_date, lecture_name
                                from (
                                        select base.category , base.lecture_id , base.instructor_name, base.lecture_price, base.student_count, base.lecture_create_date, base.lecture_name,
                                                row_number() over(partition by base.lecture_id order by base.lecture_create_date desc) as rank
                                        from base 
                                        ) base2
                                where base2.rank = 1
                                order by ${sort} desc 
                                        ) base3
                                offset ${(page - 1) * pageLength}
                                limit ${page * pageLength}
                                ;
                                `

                        const lectureList = await db.query(query)

                        return lectureList.rows
                } catch (error) {
                        // console.log(error)
                        throw Error
                }
        }

        /**
         * 강의 목록 상세조회 한다.
         * 
         */
        public async lectuerDetail(id: string) {
                try {
                        const query = `
                                select l.lecture_name , 
                                        l.lecture_introduction , 
                                        l.category , l.lecture_price , 
                                        l.student_count, 
                                        l.lecture_create_date , 
                                        l.lecture_modify_date,
                                        otherTable.* 
                                from lectures l left join lateral (
                                        select jsonb_agg(json_build_object('course_signup_date',cd.course_signup_date,'student_name', s.student_name )) as students_list
                                        from course_details cd join students s
                                        on cd.student_id = s.student_id 
                                        where cd.lecture_id = l.lecture_id 
                                        ) otherTable ON true
                                where l.lecture_id = '${id}'
                                ;
                                `

                        const lectureDetails = await db.query(query)

                        return lectureDetails.rows
                } catch (error) {
                        console.log(error)
                        throw Error
                }
        }

        /**
         * 강의 id,name 확인
         * 
         */
        public async checkIdName(instructorId: string, lectureName: string) {
                try {
                        const query = `
                        select i.instructor_id, l.lecture_name
                        from instructors i join lectures l 
                        on i.instructor_id = l.instructor_id 
                        where i.instructor_id = '${instructorId}' or l.lecture_name ='${lectureName}';
                      `

                        const result = await db.query(query) // 강사 id 확인 + 강의이름 중복 확인

                        // 강사 id체크 ,이름 중복체크
                        const instructorIdCheck = result.rows.some((v) => v.instructor_id === instructorId)
                        const lecutreNameDuplicateCheck = result.rows.some((v) => v.lecture_name === lectureName)

                        if (instructorIdCheck && !lecutreNameDuplicateCheck) {
                                return true
                        } else {
                                return false
                        }
                } catch (error) {
                        // console.log(error)
                        throw Error
                }
        }

        /**
         * 강의리스트 id,name 확인
         * 
         */
        public async checkListIdName(instructorIdList: Array<string>, lectureNameList: Array<string>, req: Request) {
                try {
                        const query = `
                                select array_agg(lecture_name) as lecture_name,
                                        (select array_agg(instructor_id) as instructor_id
                                        from instructors
                                        where instructor_id in ('${instructorIdList.join(`','`)}'))
                                from lectures
                                where lecture_name in ('${lectureNameList.join(`','`)}');
                              `

                        const result = await db.query(query) // 강사 id 확인 + 강의이름 중복 확인

                        const filterList = req.body?.data?.filter((v: any) => result.rows[0].instructor_id.includes(v.instructor_id) && !result.rows[0].lecture_name.includes(v.lecture_name))

                        return filterList
                } catch (error) {
                        // console.log(error)
                        throw Error
                }
        }

        /**
         * 강의 단일 등록
         * 
         */
        public async setLecture(req: Request) {
                try {
                        const query = `
                                INSERT INTO lectures
                                (lecture_id, 
                                lecture_name, 
                                category, 
                                lecture_introduction, 
                                lecture_price, 
                                student_count, 
                                open_flag, 
                                lecture_create_date, 
                                lecture_modify_date, 
                                instructor_id)
                                VALUES(
                                '${req.body.lecture_id}', 
                                '${req.body.lecture_name}', 
                                '${req.body.category}', 
                                '${req.body.lecture_introduction}', 
                                ${req.body.lecture_price}, 
                                0, false, current_date, null, 
                                '${req.body.instructor_id}');
                                `

                        const result = await db.query(query)
                        return result.rowCount
                } catch (error) {
                        // console.log(error)
                        throw Error
                }
        }

        /**
         * 강의 대량 등록
         * 
         */
        public async setLectures(filterList: Array<any>) {
                try {

                        const insertFormat = filterList.map(v => `('${v.lecture_id}','${v.lecture_name}','${v.category}','${v.lecture_introduction}','${v.lecture_price}',0,false,current_date,null,'${v.instructor_id}')`)

                        const query = `
                                INSERT INTO lectures 
                                        (lecture_id, 
                                        lecture_name, 
                                        category, 
                                        lecture_introduction, 
                                        lecture_price, 
                                        student_count, 
                                        open_flag, 
                                        lecture_create_date, 
                                        lecture_modify_date, 
                                        instructor_id)
                                VALUES 
                                ${insertFormat}
                                RETURNING * ;
                                      `

                        const result = await db.query(query)
                        return result.rows
                } catch (error) {
                        // console.log(error)
                        throw Error
                }
        }

        /**
         * 강의 수정
         * 
         */
        public async modifyLecture(lectureId: string, lectureName: string, lectureIntroduction: string, lecturePrice: string) {
                try {
                        const query = `
                                update lectures 
                                set lecture_name = '${lectureName}', 
                                        lecture_introduction = '${lectureIntroduction}', 
                                        lecture_price = '${lecturePrice}', 
                                        lecture_modify_date = current_date 
                                where lecture_id = '${lectureId}';
                                `

                        const result = await db.query(query)
                        return result.rowCount
                } catch (error) {
                        console.log(error)
                        throw Error
                }
        }

        /**
         * 강의 id,강사 id 확인
         * 
         */
        public async checkId(instructorId: string, lectureId: string) {
                try {
                        const query = `
                        select instructor_id, lecture_id
                        from lectures 
                        where instructor_id = '${instructorId}' and lecture_id ='${lectureId}';
                      `

                        const result = await db.query(query)

                        if (result.rows.length) {
                                return true
                        } else {
                                return false
                        }
                } catch (error) {
                        console.log(error)
                        throw Error
                }

        }

        /**
         * 강의 오픈
         * 
         */
        public async openLecture(lectureId: string) {
                try {
                        const query = `
                                update lectures 
                                set open_flag = true
                                where lecture_id = '${lectureId}';
                                `

                        const result = await db.query(query)
                        return result.rowCount
                } catch (error) {
                        console.log(error)
                        throw Error
                }
        }

        /**
         * 강의 삭제
         * 
         */
        public async deleteLecture(lectureId: string) {
                try {
                        const query = `
                        delete from lectures where lecture_id = '${lectureId}';
                        `

                        const result = await db.query(query)

                        return result.rowCount
                } catch (error) {
                        console.log(error)
                        throw Error
                }
        }
}