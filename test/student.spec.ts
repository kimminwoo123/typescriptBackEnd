import request from 'supertest'
import { expect } from 'chai'

import app from '../src/index'

// 수강생 가입
describe('POST /student', () => {
    describe('성공시', () => {
        it(`201로 응답한다.`,
            (done) => {
                request(app)
                    .post('/student')
                    .send({
                        student_id: 'kikiki',
                        student_name: '김영희',
                        email: 'chulsu@naver.com'
                    })
                    .expect(201, done)
            })
    })
})

// 수강생 탈퇴
describe('delete /student', () => {
    describe('성공시', () => {
        it(`204로 응답한다.`,
            (done) => {
                request(app)
                    .delete('/student')
                    .send({
                        student_id: 'kikiki',
                    })
                    .expect(204, done)
            })
    })
})

// 수강생 강의 신청
describe('POST /student/course_req ', () => {
    describe('성공시', () => {
        it(`201로 응답한다.`,
            (done) => {
                request(app)
                    .post('/student/course_req')
                    .send({
                        "data": [
                            {
                                "lecture_id": "lecture9",
                                "student_id": "hhhhhh"
                            },
                            {
                                "lecture_id": "lecture10", // 삭제된강의
                                "student_id": "qwer"
                            },
                            {
                                "lecture_id": "lecture7", // 비공개
                                "student_id": "zxcv"
                            },
                            {
                                "lecture_id": "lecture6", // 공개강의
                                "student_id": "asdf" // 가입된 수강생
                            },
                            {
                                "lecture_id": "lecture5", // 공개강의
                                "student_id": "rtyu" // 가입된 수강생
                            }
                        ]
                    })
                    .expect(201, done)
            })
    })
    describe('이미 강의중인 강의 신청시', () => {
        it(`400로 응답한다.`,
            (done) => {
                request(app)
                    .post('/student/course_req')
                    .send({
                        "data": [
                            {
                                "lecture_id": "lecture9",
                                "student_id": "hhhhhh"
                            },
                            {
                                "lecture_id": "lecture10", // 삭제된강의
                                "student_id": "qwer"
                            },
                            {
                                "lecture_id": "lecture7", // 비공개
                                "student_id": "zxcv"
                            },
                            {
                                "lecture_id": "lecture6", // 공개강의
                                "student_id": "asdf" // 가입된 수강생
                            },
                            {
                                "lecture_id": "lecture5", // 공개강의
                                "student_id": "rtyu" // 가입된 수강생
                            }
                        ]
                    })
                    .expect(400, done)
            })
    })
})
