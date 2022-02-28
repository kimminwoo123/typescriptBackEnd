import { AbstractRepository, EntityRepository } from 'typeorm'
import { Students } from '../domains/students'


@EntityRepository(Students)
export class StudentsRepository extends AbstractRepository<Students> {

    public async save(student: Students): Promise<void> {
        await this.manager.save(student)
    }

    public async findOne(student: Students): Promise<Students | undefined> {
        return await this.manager.findOne(Students, { id: student.id })
    }

    public async findByEmail(student: Students): Promise<Students | undefined> {
        return await this.manager.findOne(Students, { studentEmail: student.studentEmail })
    }

    public async delete(student: Students): Promise<void> {
        await this.manager.delete(Students, { id: student.id })
    }
}