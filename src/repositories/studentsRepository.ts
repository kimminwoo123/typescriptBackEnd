import { AbstractRepository, EntityRepository } from 'typeorm'
import { Students } from '../domains/students'

@EntityRepository(Students)
export class StudentsRepository extends AbstractRepository<Students> {

    public async save(student: Students): Promise<Students> {
        return await this.manager.save(student)
    }

    public async findOne(id: Students['id']): Promise<Students | undefined> {
        return await this.manager.findOne(Students, { id })
    }

    public async findByEmail(email: Students['studentEmail']): Promise<Students | undefined> {
        return await this.manager.findOne(Students, { studentEmail: email })
    }

    public async delete(id: Students['id']): Promise<void> {
        await this.manager.delete(Students, { id })
    }
}