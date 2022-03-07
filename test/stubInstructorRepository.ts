import { InstructorsRepository } from '../src/repositories/instructorsRepository'
import { Instructors } from '../src/domains/instructors'
import { Lectures } from '../src/domains/lectures'

export class StubInstructorRepository extends InstructorsRepository {
    constructor() {
        super()
    }

    override async findByIdAndJoin(id: Instructors['id']): Promise<Instructors | undefined> {
        if (id === 1) {
            return Instructors.createInstructor(id,
                '얄코',
                new Date(2020, 1, 22),
                [Lectures.createLecture(4)])
        } else if (id === 3) {
            return Instructors.createInstructor(id,
                '재밌는코딩',
                new Date(2020, 1, 22),
                [Lectures.createLecture(4,
                    '타입스크립트 강의',
                    'web',
                    120000,
                    0,
                    false,
                    new Date(2022, 3, 1),
                    new Date(2022, 3, 4),
                    '타입스크립트 강의입니다.')])
        } else if (id === 9) {
            return Instructors.createInstructor(id,
                '재밌는코딩',
                new Date(2020, 1, 22),
                [Lectures.createLecture(6,
                    '자바 강의',
                    'web',
                    20000,
                    1,
                    false,
                    new Date(2022, 3, 1),
                    new Date(2022, 3, 4),
                    '자바 강의입니다.')])
        }
        else {
            return undefined
        }
    }

    override async findById(id: Instructors['id']): Promise<Instructors | undefined> {
        if (id === 1) {
            return Instructors.createInstructor(id, '얄팍한 코딩사전', new Date(2021, 12, 1))
        } else {
            return undefined
        }
    }
}