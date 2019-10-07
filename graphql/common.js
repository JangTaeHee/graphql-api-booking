const mysql = require('../db/mysqlPool');

// 사용자 목록 조회
export const getUser = async (ID) => {
    const query = `
    SELECT
        ID,
        NAME,
        DEPARTMENT
    FROM USER
    WHERE ID = '${ID}'
    `
    const [rows] = await mysql.pool.query(query)
    return rows[0]
}

// 회의실 목록 조회
export const getAllMeetingRoom = async (ID) => {
    const query = `
    SELECT
        ID,
        NAME,
        SIZE
    FROM MEETING_ROOM
    WHERE ID = '${ID}'
    `
    const [rows] = await mysql.pool.query(query)
    return rows[0]
}

// 회의실 예약 목록 조회
export const getReservation = async () => {
    const query = `
    SELECT
        IDX,
        USER_ID,
        ROOM_ID,
        DATE_FORMAT(START_DTTM, '%Y-%m-%d %T') AS START_DTTM,
        DATE_FORMAT(END_DTTM, '%Y-%m-%d %T') AS END_DTTM
    FROM RESERVATION
    WHERE YEARWEEK(START_DTTM) = YEARWEEK(NOW())
    ORDER BY START_DTTM
    `
    const [rows] = await mysql.pool.query(query)
    return rows
}

// 예약 가능 회의실 목록 조회
export const getMeetingRoom = async (START_DTTM,END_DTTM) => {
    const query = `
    SELECT
        ID,
        NAME,
        SIZE
    FROM MEETING_ROOM
    WHERE ID NOT IN (
        SELECT
            ROOM_ID
        FROM RESERVATION
  	    WHERE START_DTTM < '${END_DTTM}'
          AND END_DTTM > '${START_DTTM}'
    )
    ORDER BY SIZE
    `
    const [rows] = await mysql.pool.query(query)
    return rows
}

// 회의실 예약
export const addReservation = async (USER_ID, ROOM_ID, START_DTTM, END_DTTM) => {
    const query = `
    INSERT INTO RESERVATION (IDX, USER_ID, ROOM_ID, START_DTTM, END_DTTM) 
    SELECT 
        NULL,'${USER_ID}','${ROOM_ID}','${START_DTTM}','${END_DTTM}'
    FROM DUAL
    WHERE NOT EXISTS(
      SELECT
  	    IDX
      FROM RESERVATION
      WHERE ROOM_ID = '${ROOM_ID}'
  	  AND START_DTTM < '${END_DTTM}'
  	  AND END_DTTM > '${START_DTTM}'
    )
    `
    const [rows] = await mysql.pool.query(query)
    if(rows.affectedRows > 0) return "예약 성공."
    else return "예약 불가, 이미 예약된 회의실입니다."
}