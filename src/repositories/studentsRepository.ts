import { Repository, DeleteResult, EntityRepository, createQueryBuilder } from 'typeorm'
import { Students } from '../domains/students'

@EntityRepository(Students)
export class StudentsRepository extends Repository<Students> {
    constructor() {
        super()
    }

    public async saveByStudent(student: Students): Promise<Students> {
        try {
            const saveResult = await createQueryBuilder()
                .insert()
                .into(Students)
                .values(student)
                .returning('*')
                .execute()

            const saveStudent = saveResult.generatedMaps[0]

            const id = saveStudent.id
            const name = saveStudent.studentName
            const email = saveStudent.studentEmail
            const registDate = saveStudent.registDate

            return Students.createStudent(id, name, email, registDate)
        } catch (error) {
            console.log(error)
            throw new Error('StudentsRepository saveStudent 오류')
        }
    }

    public async findById(id: Students['id']): Promise<Students | undefined> {
        try {
            return await createQueryBuilder()
                .select(['Students.id', 'Students.studentName', 'Students.studentEmail', 'Students.registDate'])
                .from(Students, 'Students')
                .where('Students.id = :id', { id })
                .getOne()
        } catch (error) {
            console.log(error)
            throw new Error('StudentsRepository findById 오류')
        }
    }

    public async findByEmail(email: Students['studentEmail']): Promise<Students | undefined> {
        try {
            return await createQueryBuilder()
                .select(['Students.id', 'Students.studentName', 'Students.studentEmail', 'Students.registDate'])
                .from(Students, 'Students')
                .where('Students.studentEmail = :email', { email })
                .getOne()
        } catch (error) {
            console.log(error)
            throw new Error('StudentsRepository findByEmail 오류')
        }
    }

    public async deleteById(id: Students['id']): Promise<Students> {
        try {
            const deleteResult = await createQueryBuilder()
                .delete()
                .from(Students).where('Students.id = :id', { id })
                .returning('*')
                .execute()

            const deleteStudent = deleteResult.raw[0]

            return Students.createStudent(deleteStudent.id,
                deleteStudent.student_name,
                deleteStudent.student_email,
                deleteStudent.regist_date)
        } catch (error) {
            console.log(error)
            throw new Error('StudentsRepository findByEmail 오류')
        }
    }
}