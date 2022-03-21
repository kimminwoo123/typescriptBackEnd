import { LectureService } from '../src/services/lectureService'
import { LectureRequest } from '../src/dto/lectureRequest'
import { StubLecturesRepository } from './stubLecturesRepository'
import { StubInstructorRepository } from './stubInstructorRepository'
import { Instructors } from '../src/entities/instructors'
import { Lectures } from '../src/entities/lectures'

describe('LecturesService', () => {
    let lectureService = new LectureService(new StubLecturesRepository(), new StubInstructorRepository())

    beforeEach(() => {
        lectureService = new LectureService(new StubLecturesRepository(), new StubInstructorRepository())
    })

    describe('searchCondition', () => {
        it('조건에 따른 강의를 검색한다', async () => {
            // give
            expect.assertions(2)
            const request = new LectureRequest('web', '노드js', 'studentCount', 1, 3)

            // when
            const saveStudent = await lectureService.searchCondition(request)

            // then
            expect(saveStudent).toHaveLength(1)
            expect(saveStudent).toStrictEqual([{
                id: 6,
                category: 'web',
                lectureName: 'vex',
                lecturePrice: 26700,
                studentCount: 343,
                lectureCreateDate: new Date(2022, 2, 12),
                lectureIntroduction: '복붙하며, Rea',
                instructorName: '얄팍한 코딩사전',
            }])
        })
    })
    describe('searchDetail', () => {
        it('강의 상세 내역을 검색한다', async () => {
            // give
            expect.assertions(1)
            const lectureId = 1

            // when
            const saveStudent = await lectureService.searchDetail(lectureId)

            // then
            expect(saveStudent).toEqual({
                id: 1,
                lectureName: '갖고노는 MySQL 데이터베이스 by 얄코',
                category: 'db',
                lectureIntroduction: '비전공자도 이해할 수 있는 MySQL! 빠른 설명으로 필수개념만 훑은 뒤 사이트의 예제들과 함께 MySQL을 ‘갖고 놀면서’ 손으로 익힐 수 있도록 만든 강좌입니다.',
                lecturePrice: 14300,
                studentCount: 444,
                openFlag: true,
                lectureCreateDate: new Date(2022, 1, 3),
                lectureModifyDate: new Date(2022, 1, 4),
                // courseDetail: [{
                //     registDate: new Date(2022, 1, 4),
                //     student: [{
                //         id: 1,
                //         studentName: "별주부",
                //         studentEmail: "qwer@gmail.com",
                //         registDate: new Date(2022, 1, 1)
                //     }]
                // }]
            })
        })

        it('없는 강의 id일 때 error', async () => {
            // give
            expect.assertions(1)
            const lectureId = 4

            // when
            await expect(lectureService.searchDetail(lectureId))
                .rejects
                // then
                .toThrow('잘못된 강의 id 입니다.')
        })

        it('open 되지않은 강의일때 error', async () => {
            // give
            expect.assertions(1)
            const lectureId = 3

            // when
            await expect(lectureService.searchDetail(lectureId))
                .rejects
                // then
                .toThrow('오픈 되지 않은 강의 입니다.')
        })
    })

    describe('create', () => {
        it('강의를 생성한다.', async () => {
            // give
            expect.assertions(2)
            const instructor = Instructors.createInstructor(1)
            const lectureList: Lectures[] = [
                Lectures.createLecture(undefined, 'cnc', 'web', 1234, 0, false, new Date(2022, 1, 1), undefined, 'Cnc 강의입니다.'),
                Lectures.createLecture(undefined, 'bnb', 'game', 5353, 0, false, new Date(2022, 1, 1), undefined, 'bnb 강의입니다.'),
                Lectures.createLecture(undefined, '테스트', 'algo', 444, 0, false, new Date(2022, 1, 1), undefined, '테스트 강의입니다.'),
            ]

            // when
            const result = await lectureService.create(instructor, lectureList)

            // then
            expect(result).toEqual([
                {
                    id: 1,
                    lectureName: 'cnc',
                    category: 'web',
                    lecturePrice: 1234,
                    studentCount: 0,
                    openFlag: false,
                    lectureCreateDate: new Date(2022, 1, 1),
                    lectureModifyDate: undefined,
                    lectureIntroduction: 'Cnc 강의입니다.'
                },
                {
                    id: 2,
                    lectureName: 'bnb',
                    category: 'game',
                    lecturePrice: 5353,
                    studentCount: 0,
                    openFlag: false,
                    lectureCreateDate: new Date(2022, 1, 1),
                    lectureModifyDate: undefined,
                    lectureIntroduction: 'bnb 강의입니다.'
                }
            ])
            expect(result).toHaveLength(2)
        })
        it('잘못된 강사id일 때 error', async () => {
            // give
            expect.assertions(1)
            const instructor = Instructors.createInstructor(2)
            const lectureList: Lectures[] = [
                Lectures.createLecture(undefined, 'cnc', 'web', 1234, 0, false, new Date(2022, 1, 1), undefined, 'Cnc 강의입니다.'),
                Lectures.createLecture(undefined, 'bnb', 'game', 5353, 0, false, new Date(2022, 1, 1), undefined, 'bnb 강의입니다.'),
                Lectures.createLecture(undefined, '테스트', 'algo', 444, 0, false, new Date(2022, 1, 1), undefined, '테스트 강의입니다.'),
            ]

            // when
            await expect(lectureService.create(instructor, lectureList))
                .rejects
                // then
                .toThrow('잘못된 강사 id입니다.')
        })
    })

    describe('update', () => {
        it('강의를 수정한다.', async () => {
            // give
            expect.assertions(1)
            const instructor = Instructors.createInstructor(1)
            const lecture = Lectures.createLecture(4, '타입스크립트 강의', undefined, 120000, undefined, undefined, undefined, new Date(2022, 3, 1), '타입스크립트 강의입니다.')

            // when
            const result = await lectureService.update(instructor, lecture)

            // then
            expect(result).toEqual({
                id: 4,
                category: "web",
                lectureIntroduction: "타입스크립트 강의입니다.",
                lectureModifyDate: new Date(2022, 3, 5),
                lectureName: '타입스크립트 강의',
                lecturePrice: 120000,
                openFlag: false,
                studentCount: 0,
            })
        })
        it('잘못된 강사id일 때 error', async () => {
            // give
            expect.assertions(1)
            const instructor = Instructors.createInstructor(2)
            const lecture = Lectures.createLecture(4, '타입스크립트 강의', undefined, 120000, undefined, undefined, undefined, new Date(2022, 3, 1), '타입스크립트 강의입니다.')

            // when
            await expect(lectureService.update(instructor, lecture))
                .rejects
                // then
                .toThrow('잘못된 강사 id입니다.')
        })
        it('잘못된 강의id일 때 error', async () => {
            // give
            expect.assertions(1)
            const instructor = Instructors.createInstructor(1)
            const lecture = Lectures.createLecture(3, 'java 강의', undefined, 90000, undefined, undefined, undefined, new Date(2022, 3, 3), '자바 강의입니다.')

            // when
            await expect(lectureService.update(instructor, lecture))
                .rejects
                // then
                .toThrow('잘못된 강의 id입니다.')
        })
    })

    describe('delete', () => {
        it('강의를 삭제한다.', async () => {
            // give
            expect.assertions(1)
            const instructor = Instructors.createInstructor(3)
            const lecture = Lectures.createLecture(4)

            // when
            const result = await lectureService.delete(instructor, lecture)

            // then
            expect(result).toEqual({
                id: 4,
                category: "web",
                lectureIntroduction: "타입스크립트 강의입니다.",
                lectureCreateDate: new Date(2022, 3, 1),
                lectureModifyDate: new Date(2022, 3, 4),
                lectureName: '타입스크립트 강의',
                lecturePrice: 120000,
                openFlag: false,
                studentCount: 0,
            })
        })
        it('잘못된 강사id일 때 error', async () => {
            // give
            expect.assertions(1)
            const instructor = Instructors.createInstructor(4)
            const lecture = Lectures.createLecture(4)

            // when
            await expect(lectureService.delete(instructor, lecture))
                .rejects
                // then
                .toThrow('잘못된 강사 id입니다.')
        })
        it('잘못된 강의id일 때 error', async () => {
            // give
            expect.assertions(1)
            const instructor = Instructors.createInstructor(3)
            const lecture = Lectures.createLecture(5)

            // when
            await expect(lectureService.delete(instructor, lecture))
                .rejects
                // then
                .toThrow('잘못된 강의 id입니다.')
        })
        it('수강중인 학생이 있을때 error', async () => {
            // give
            expect.assertions(1)
            const instructor = Instructors.createInstructor(9)
            const lecture = Lectures.createLecture(6)

            // when
            await expect(lectureService.delete(instructor, lecture))
                .rejects
                // then
                .toThrow('수강중인 학생이 있습니다.')
        })
    })
})