import request from 'supertest'
import { expect } from 'chai'

import app from '../src/index'

// 강의 목록조회
describe('GET /lectures는', () => {
    describe('성공시', () => {
        it(`배열안의 객체 형태의 강의들을 응답하고, 강의ID, 카테고리, 강의명, 강사명, 가격, 수강생수, 강의생성일자를 응답한다..`,
            (done) => {
                request(app)
                    .get('/lectures')
                    .query({
                        page: 1,
                        search: '얄팍한 코딩사전',
                        category: 'web',
                        sort: 'student_count',
                    })
                    .expect(200)
                    .end((err, res) => {
                        // console.log(res.body)
                        expect(res.body).to.be.an('array')
                        expect(res.body[0]).to.have.all.keys(
                            'category',
                            'lecture_id',
                            'instructor_name',
                            'lecture_price',
                            'student_count',
                            'lecture_create_date',
                            'lecture_name')
                        done()
                    })
            })
    })
})

// 강의 상세조회
describe('GET /lectures/detail은', () => {
    describe('성공시', () => {
        it(`배열형태로 응답하고, 강의명, 카테고리, 강의소개, 가격, 수강생수, 강의생성일자/수정일자, 학생리스트 응답한다.`,
            (done) => {
                request(app)
                    .get('/lectures/detail')
                    .query({
                        id: 'lecture3',
                    })
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.be.an('array')
                        expect(res.body[0]).to.have.all.keys(
                            'lecture_name',
                            'lecture_introduction',
                            'category',
                            'lecture_price',
                            'student_count',
                            'lecture_create_date',
                            'lecture_modify_date',
                            'students_list',
                        )
                        done()
                    })
            })
    })
})

// 강의 단일 생성
describe('POST /lectures는 ', () => {
    describe('성공시', () => {
        it(`201로 응답한다.`,
            (done) => {
                request(app)
                    .post('/lectures')
                    .send({
                        lecture_id: 'lecture20',
                        lecture_name: 'zzzzzzz',
                        category: 'game',
                        lecture_introduction: 'xxxxxxxxx',
                        lecture_price: '5678',
                        instructor_id: 'qwerfcx'
                    })
                    .expect(201, done)
            })
    })
})

// 강의 수정
describe('PUT /lectures는 ', () => {
    describe('성공시', () => {
        it(`200로 응답한다.`,
            (done) => {
                request(app)
                    .put('/lectures')
                    .send({
                        lecture_id: 'lecture20',
                        lecture_name: 'postgres',
                        lecture_introduction: 'postgres 강의',
                        lecture_price: '9999999',
                        instructor_id: 'qwerfcx'
                    })
                    .expect(200, done)
            })
    })
})

// 강의 오픈
describe('patch /lectures는 ', () => {
    describe('성공시', () => {
        it(`200로 응답한다.`,
            (done) => {
                request(app)
                    .patch('/lectures')
                    .send({
                        lecture_id: 'lecture20',
                        instructor_id: 'qwerfcx'
                    })
                    .expect(200, done)
            })
    })
})

// 강의 삭제
describe('delete /lectures는 ', () => {
    describe('성공시', () => {
        it(`204로 응답한다.`,
            (done) => {
                request(app)
                    .delete('/lectures')
                    .send({
                        lecture_id: 'lecture20',
                        instructor_id: 'qwerfcx'
                    })
                    .expect(204, done)
            })
    })
})

// 강의 대량 생성
describe('POST /lectures/blocks는 ', () => {
    describe('성공시', () => {
        it(`201로 응답한다.`,
            (done) => {
                request(app)
                    .post('/lectures/blocks')
                    .send({
                        "data": [
                            {
                                "lecture_id": "lecture30",
                                "lecture_name": "자바",
                                "category": "web",
                                "lecture_introduction": "자바 스프링",
                                "lecture_price": "39900",
                                "instructor_id": "yalco"
                            },
                            {
                                "lecture_id": "lecture31",
                                "lecture_name": "자바스크립트",
                                "category": "web",
                                "lecture_introduction": "자바스크립트",
                                "lecture_price": "29900",
                                "instructor_id": "yhv"
                            },
                            {
                                "lecture_id": "lecture32",
                                "lecture_name": "노드js",
                                "category": "web",
                                "lecture_introduction": "노드js",
                                "lecture_price": "19900",
                                "instructor_id": "yhv"
                            },
                            {
                                "lecture_id": "lecture33",
                                "lecture_name": "시퀄라이저",
                                "category": "db",
                                "lecture_introduction": "시퀄라이저",
                                "lecture_price": "5550",
                                "instructor_id": "yhv"
                            },
                            {
                                "lecture_id": "lecture34",
                                "lecture_name": "오라클",
                                "category": "db",
                                "lecture_introduction": "오라클",
                                "lecture_price": "45435",
                                "instructor_id": "qwerfcx"
                            },
                            {
                                "lecture_id": "lecture35",
                                "lecture_name": "C언어",
                                "category": "game",
                                "lecture_introduction": "강사이름 체크",
                                "lecture_price": "11111",
                                "instructor_id": "zzzzzzz"
                            },
                            {
                                "lecture_id": "lecture36",
                                "lecture_name": "테스트",
                                "category": "game",
                                "lecture_introduction": "강의이름 중복 테스트",
                                "lecture_price": "656766",
                                "instructor_id": "yhv"
                            }
                        ]
                    })
                    .expect(201, done)
            })
    })
})