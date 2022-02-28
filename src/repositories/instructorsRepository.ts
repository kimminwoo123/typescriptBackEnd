import { EntityManager, EntityRepository, AbstractRepository } from 'typeorm'
import { Instructors } from '../domains/instructors'

@EntityRepository(Instructors)
export class InstructorsRepository extends AbstractRepository<Instructors>{
    public async save(instructor: Instructors): Promise<void> {
        await this.manager.save(instructor)
    }

    // public async findOne(instructor: Instructors): Promise<Instructors | undefined> {
    //     return await this.findOne(Instructors)
    // }

    public async findAll(): Promise<Instructors[]> {
        return await this.manager.find(Instructors)
    }
}