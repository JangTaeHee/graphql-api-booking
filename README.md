비지니스의 요구사항을 주어진 기술(GraphQL)로 구현할 수 있는지 확인하는 과제입니다.

간단한 회의실 예약 시스템에 대한 요구사항을 만족하는 GraphQL API 서버를 만들면 됩니다.

# 요구사항

## 데이터
* 사용자 테이블은 다음과 같은 컬럼을 가집니다.
    * ID
    * 이름
    * 소속
* 회의실 테이블은 다음과 같은 컬럼을 가집니다.
    * ID
    * 이름
    * 크기(4인/6인/8인)
* 예약 테이블은 다음과 같은 컬럼을 가집니다.
    * 사용자 ID
    * 회의실 ID
    * 예약 시간(시작-끝 또는 시작-기간)
* 데이터는 DBMS(MySQL, MongoDB등)에 저장해주세요.

## 제공할 API
GraphQL을 통해 다음과 같은 기능을 수행할 수 있도록 해주세요.

* 회의실 예약
    * 주어진 시각에 예약이 있으면 에러를 반환해주세요.
* 이번 주 회의실 예약 내역 얻기
    * 캘린더에 표시해주기 위한 목적입니다. 예약한 사용자 소속, 회의실 이름도 같이 얻을 수 있어야 합니다.
* 주어진 시간에 비어있는 회의실 목록 얻기
    * 회의실 예약시 참고하기 위해 주어진 시각에 비어있는 회의실 목록을 반환합니다.

## 기타
* 목록을 반환할 때는 캐시를 사용해주세요.
* API 요구사항이 잘 구현됐는지 확인 가능한 기본 데이터 셋과 API 예를 제출해주시면 좋습니다.
* 테스트 코드를 작성하면 더 좋습니다.
* 프로덕션 환경에 사용한다는 가정하에 작성해주세요.

# 평가기준
* 요구사항 만족도
* 코드 구성 / 코드 가독성 (불필요한 주석은 없는 것을 선호합니다)

 # 실행
 ```bash
 $ npm i nodemon -g
 $ npm i
 $ npm start
 ```

 # 샘플 데이터 구조 (MySQL)
```
CREATE TABLE `user` (
  `ID` varchar(20) NOT NULL COMMENT 'ID',
  `NAME` varchar(50) NOT NULL COMMENT '이름',
  `DEPARTMENT` varchar(20) NOT NULL COMMENT '소속',
  PRIMARY KEY (`ID`)
);

CREATE TABLE `meeting_room` (
  `ID` varchar(20) NOT NULL COMMENT 'ID',
  `NAME` varchar(50) NOT NULL COMMENT '이름',
  `SIZE` int(2) NOT NULL COMMENT '크기',
  PRIMARY KEY (`ID`)
);

CREATE TABLE `reservation` (
  `IDX` int(6) NOT NULL AUTO_INCREMENT COMMENT '순번',
  `USER_ID` varchar(20) NOT NULL COMMENT '사용자 ID',
  `ROOM_ID` varchar(20) NOT NULL COMMENT '회의실 ID',
  `START_DTTM` datetime NOT NULL COMMENT '시작 일시',
  `END_DTTM` datetime NOT NULL COMMENT '종료 일시',
  PRIMARY KEY (`IDX`)
);

INSERT INTO `user` (ID, NAME, DEPARTMENT) VALUES ('jang', '장태희', '개발팀');
INSERT INTO `user` (ID, NAME, DEPARTMENT) VALUES ('hong', '홍길동', '기획팀');
INSERT INTO `user` (ID, NAME, DEPARTMENT) VALUES ('kim', '김혜영', '디자인팀');

INSERT INTO `meeting_room` (ID, NAME, SIZE) VALUES ('guam', '괌', 4);
INSERT INTO `meeting_room` (ID, NAME, SIZE) VALUES ('tahiti', '타히티', 6);
INSERT INTO `meeting_room` (ID, NAME, SIZE) VALUES ('hawaii', '하와이', 8);
```
# API 예시 (graphql)
```
URL : localhost:4000
Method : POST

// 예약 목록 조회
query{
  reservation_list {
    USER{
    	NAME,
      DEPARTMENT
    },
    ROOM{
    	NAME
    },
    START_DTTM,
    END_DTTM
  }
}

// 예약 가능 회의실 조회
query{
  meeting_room_list(START_DTTM:"2019-10-07 13:00:00",END_DTTM:"2019-10-07 15:00:00") {
    ID,
    NAME,
    SIZE
  }
}

// 회의실 예약
mutation{
  addReservation(
    USER_ID:"jang",
    ROOM_ID:"hawaii",
    START_DTTM:"2019-10-07 16:00:00",
    END_DTTM:"2019-10-07 17:00:00"
  )
}

// 예약 목록 및 예약 가능 회의실 조회
query{
  reservation_list {
    USER{
    	NAME,
      DEPARTMENT
    },
    ROOM{
    	NAME
    },
    START_DTTM,
    END_DTTM
  }
  meeting_room_list(START_DTTM:"2019-10-07 13:00:00",END_DTTM:"2019-10-07 15:00:00") {
    ID,
    NAME,
    SIZE
  }
}
```
# API 예시 (json)
```
URL : localhost:4000
Method : POST
Content-Type: application/json

// 예약 목록 조회
{ 
	"query": "{ reservation_list { USER { NAME, DEPARTMENT }, ROOM { NAME }, START_DTTM, END_DTTM } }"
}

// 예약 가능 회의실 조회
{ 
	"query": "{ meeting_room_list(START_DTTM:\"2019-10-07 13:00:00\",END_DTTM:\"2019-10-07 15:00:00\") { ID, NAME, SIZE } }" 
}


// 회의실 예약
{ 
	"query": "mutation{ addReservation(USER_ID:\"jang\", ROOM_ID:\"hawaii\", START_DTTM:\"2019-10-07 16:00:00\", END_DTTM:\"2019-10-07 17:00:00\") }" 
}

// 예약 목록 및 예약 가능 회의실 조회
{ 
	"query": "{ reservation_list { USER { NAME, DEPARTMENT }, ROOM { NAME }, START_DTTM, END_DTTM },  meeting_room_list(START_DTTM:\"2019-10-07 13:00:00\",END_DTTM:\"2019-10-07 15:00:00\") { ID, NAME, SIZE } }"
}
```