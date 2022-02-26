import { Router, Response, Request, NextFunction } from "express"
import { Service } from "typedi"
import db from '../../db/pg'

@Service()
export class StudentService {
        constructor() { }

        /**
         * 학생 id, eamil 확인
         * 
         */
        public async checkIdEmail(id: string, email: string) {
                try {
                        const query = `
                        select *
                        from students
                        where student_id = '${id}' or email = '${email}';
                      `

                        const result = await db.query(query)

                        // 학생 id, eamil 체크
                        const studentIdEmailCheck = result.rows.some((v) => v.student_id === id || v.email === email)

                        if (!studentIdEmailCheck) { // 중복이 아닐때
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
        * 학생 id 확인
        * 
        */
        public async checkId(id: string) {
                try {
                        const query = `
                        select *
                        from students
                        where student_id = '${id}';
                      `

                        const result = await db.query(query)

                        if (!result.rows.length) {
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
        * 강의id, 학생id 확인
        * 
        */
        public async checkCourese(lectureIdList: Array<string>, studnetIdList: Array<string>, req: Request) {
                try {
                        const query = `
                                select array_agg(lecture_id) as lecture_id ,
                                        (select array_agg(student_id) as student_id
                                        from students
                                        where student_id in ('${studnetIdList.join(`','`)}'))
                                from lectures
                                where open_flag = true 
                                and lecture_id in ('${lectureIdList.join(`','`)}');
                              `
                        const result = await db.query(query)

                        // req데이터에서 가입된 수강생과 강의신청 가능한 강의 추출
                        const filterResult = req.body.data?.filter((v: any) => result.rows[0].lecture_id.includes(v.lecture_id) && result.rows[0].student_id.includes(v.student_id))
                        return filterResult
                } catch (error) {
                        console.log(error)
                        throw Error
                }
        }

        /**
        * 수강신청
        * 
        */
        public async reqCourese(filterList: Array<any>) {
                try {
                        const insertFormat = filterList.map(v => `('${v.lecture_id}','${v.student_id}')`)

                        const query = `
                                INSERT INTO course_details (lecture_id, student_id)
                                VALUES 
                                ${insertFormat}
                                RETURNING * ;
                                      `

                        const result = await db.query(query)
                        return result.rows
                } catch (error) {
                        console.log(error)
                        throw Error
                }
        }

        /**
         * 수강생 가입
         * 
         */
        public async createStudent(id: string, studentName: string, email: string) {
                try {
                        const query = `
                                INSERT INTO students
                                (student_id, email, student_name, regist_date)
                                VALUES('${id}', '${email}', '${studentName}', current_date)
                                RETURNING * ;
                                `

                        const result = await db.query(query)

                        return result.rowCount
                } catch (error) {
                        console.log(error)
                        throw Error
                }

        }

        /**
         * 수강생 탈퇴
         * 
         */
        public async deleteStudent(student_id: string) {
                try {
                        const courseQuery = `
                                delete from course_details where student_id = '${student_id}';
                                `
                        const studentQuery = `
                                delete from students where student_id = '${student_id}';
                                `

                        await db.query(courseQuery)
                        const studentResult = await db.query(studentQuery)

                        if (studentResult.rowCount) {
                                return true
                        } else {
                                return false
                        }
                } catch (error) {
                        console.log(error)
                        throw Error
                }
        }
}