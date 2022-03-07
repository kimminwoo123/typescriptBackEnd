import { EntityManager, EntityRepository, AbstractRepository, createQueryBuilder } from 'typeorm'
import { Instructors } from '../domains/instructors'

@EntityRepository(Instructors)
export class InstructorsRepository extends AbstractRepository<Instructors>{
    public async findById(id: Instructors['id']): Promise<Instructors | undefined> {
        return await createQueryBuilder(Instructors, 'i')
            .where('i.id = :id', { id })
            .getOne()
    }

    public async findByIdAndJoin(id: Instructors['id']): Promise<Instructors | undefined> {
        return await createQueryBuilder(Instructors, 'i')
            .leftJoinAndSelect('i.lectures', 'l')
            .where('i.id = :id', { id })
            .getOne()
    }
}