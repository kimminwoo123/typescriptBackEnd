import { EntityManager, EntityRepository, AbstractRepository, createQueryBuilder } from 'typeorm'
import { Instructors } from '../domains/instructors'

@EntityRepository(Instructors)
export class InstructorsRepository extends AbstractRepository<Instructors>{
    public async save(instructor: Instructors): Promise<void> {
        await this.manager.save(instructor)
    }

    public async findById(id: Instructors['id']): Promise<Instructors | undefined> {
        return await createQueryBuilder(Instructors, 'i')
            .where('i.id = :id', { id })
            .getOne()
    }

    public async findAll(): Promise<Instructors[]> {
        return await this.manager.find(Instructors)
    }
}