import db from './db/pg'

db.connect() // db연결
	.then(() => {
		console.log('db 연결 성공')
	})
	.catch(console.error)

// 테이블 생성 코드
// 강사
db.query(`CREATE TABLE public.instructors (
	instructor_id text NOT NULL,
	instructor_name text NOT NULL,
	regist_date date NOT NULL,
	CONSTRAINT "PK_INSTRUCTORS" PRIMARY KEY (instructor_id)
);`)
// 강의목록
db.query(`CREATE TABLE public.lectures (
	lecture_id text NOT NULL,
	lecture_name text NOT NULL,
	category text NOT NULL,
	lecture_introduction text NULL,
	lecture_price int4 NOT NULL,
	student_count int4 NOT NULL,
	open_flag bool NOT NULL,
	lecture_create_date date NOT NULL,
	lecture_modify_date date NULL,
	instructor_id text NOT NULL,
	CONSTRAINT "PK_LECTURE" PRIMARY KEY (lecture_id),
	CONSTRAINT check_category CHECK ((category = ANY (ARRAY['web'::text, 'app'::text, 'game'::text, 'algo'::text, 'infra'::text, 'db'::text])))
);`)
// 학생
db.query(`CREATE TABLE public.students (
	student_id text NOT NULL,
	email text NOT NULL,
	student_name text NOT NULL,
	regist_date date NOT NULL,
	CONSTRAINT "PK_STUDENTS" PRIMARY KEY (student_id),
	CONSTRAINT students_un UNIQUE (email)
);`)
// 강의신청
db.query(`CREATE TABLE public.course_details (
	lecture_id text NOT NULL,
	student_id text NOT NULL,
	course_signup_date date NOT NULL DEFAULT CURRENT_DATE,
	CONSTRAINT "PK_COURSE_DETAILS" PRIMARY KEY (lecture_id, student_id)
);`)
db.query(`ALTER TABLE public.course_details ADD CONSTRAINT "FK_lecture_TO_course_details_1" FOREIGN KEY (lecture_id) REFERENCES lectures(lecture_id);
`)
db.query(`ALTER TABLE public.course_details ADD CONSTRAINT "FK_students_TO_course_details_1" FOREIGN KEY (student_id) REFERENCES students(student_id);`)

// 데이터 insert
db.query(`INSERT INTO public.instructors (instructor_id,instructor_name,regist_date) VALUES
('yalco','얄팍한 코딩사전','2022-01-28'),
('yhv','김영한v','2022-01-28'),
('qwerfcx','asdf','2022-01-29');`)

db.query(`INSERT INTO public.students (student_id,email,student_name,regist_date) VALUES
('qwer','qwer@gmail.com','별주부','2022-01-28'),
('asdf','asdf@gmail.com','홍길동','2022-01-28'),
('zxcv','zxcv@gmail.com','김초롱','2022-01-28'),
('rtyu','rtyu@gmail.com','김철수','2022-01-28');`)

db.query(`INSERT INTO public.lectures (lecture_id,lecture_name,category,lecture_introduction,lecture_price,student_count,open_flag,lecture_create_date,lecture_modify_date,instructor_id) VALUES
('lecture1','제대로 파는 Git & GitHub - by 얄코','infra','유튜브 채널 얄팍한 코딩사전을 방송하는 코딩 유튜버입니다.  어려운 프로그래밍 개념들을 초보자들이 이해하기 쉽도록 비유와 쉬운 예제, 때로는 애니메이션으로 설명하는 컨텐츠들을 만들고 있습니다.  낮에는 스타트업에서 풀스택 개발자로서 프로그래밍을 하고 있습니다.',30800,211,true,'2022-01-28',NULL,'yalco'),
('lecture2','갖고노는 MySQL 데이터베이스 by 얄코','db','비전공자도 이해할 수 있는 MySQL! 빠른 설명으로 필수개념만 훑은 뒤 사이트의 예제들과 함께 MySQL을 ‘갖고 놀면서’ 손으로 익힐 수 있도록 만든 강좌입니다.',14300,444,true,'2022-01-28',NULL,'yalco'),
('lecture3','얄코의 반응형 프로그래밍 - 자바스크립트로 쉽게 배우는 ReactiveX','web','⚡ 짧고 굵은 전체 160분 강좌! 웹사이트에서 웹사이트로 코드를 복붙하며, ReactiveX를 통한 반응형 프로그래밍을 익히세요 😎',29700,302,true,'2022-01-28',NULL,'yalco'),
('lecture5','vgt','web',' 복붙며, R',16700,252,true,'2022-01-28',NULL,'yalco'),
('lecture6','asdf','db',' 복붙며, R',6700,22,true,'2022-01-29',NULL,'yhv'),
('lecture4','vex','web',' 복붙하며, Rea',26700,352,true,'2022-01-28',NULL,'yalco'),
('lecture8','노드 js 강의','infra','노드 js강의입니다.',9900,0,true,'2022-02-01',NULL,'qwerfcx'),
('lecture7','테스트','algo',' 테스트, R',12300,798,false,'2022-01-29',NULL,'qwerfcx'),
('lecture9','fr43','game','ghgh',456,0,true,'2022-02-03','2022-02-07','qwerfcx');`)

db.query(`INSERT INTO public.course_details (lecture_id,student_id,course_signup_date) VALUES
('lecture1','rtyu','2022-01-28'),
('lecture1','zxcv','2022-01-28'),
('lecture1','qwer','2022-01-28'),
('lecture1','asdf','2022-01-28'),
('lecture3','asdf','2022-01-28'),
('lecture3','qwer','2022-01-28'),
('lecture3','zxcv','2022-01-28'),
('lecture3','rtyu','2022-01-31'),
('lecture2','qwer','2022-01-31'),
('lecture7','qwer','2022-02-05');`)
