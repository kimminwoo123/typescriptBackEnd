import { Students } from '../src/domains/students'
import { StudentsRepository } from '../src/repositories/studentsRepository'

export class StubStudentsRepository extends StudentsRepository {
    constructor() {
        super()
    }

    override async saveByStudent(student: Students): Promise<Students> {
        return Students.createStudent(student.id, student.studentName, student.studentEmail, student.registDate)
    }

    override async findById(id: Students['id']): Promise<Students | undefined> {
        if (id === 1) {
            return Students.createStudent(id, '말레니아', 'malenia@gmail.com', new Date(2022, 1, 22))
        } else {
            return undefined
        }
    }

    override async findByEmail(email: Students['studentEmail']): Promise<Students | undefined> {
        if (email === 'gerolt@gmail.com') {
            return Students.createStudent(2, '게롤트', email, new Date(2022, 1, 22))
        } else {
            return undefined
        }
    }

    override async deleteById(id: Students['id']): Promise<Students> {
        return Students.createStudent(id, '게롤트', 'gerolt@gmail.com', new Date(2022, 1, 22))
    }
}