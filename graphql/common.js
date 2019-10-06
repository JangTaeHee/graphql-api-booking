const mysql = require('../db/mysqlPool');

// 회의실 예약 목록 조회
export const getReservation = async () => {
    const query = `
    SELECT
        R.IDX,
        R.USER_ID,
        U.NAME AS USER_NM,
        U.DEPARTMENT,
        R.ROOM_ID,
        M.NAME AS ROOM_NM,
        DATE_FORMAT(R.START_DTTM, '%Y-%m-%d %T') AS START_DTTM,
        DATE_FORMAT(R.END_DTTM, '%Y-%m-%d %T') AS END_DTTM
    FROM RESERVATION R
    LEFT JOIN USER U
    ON R.USER_ID = U.ID
    LEFT JOIN MEETING_ROOM M
    ON R.ROOM_ID = M.ID
    WHERE YEARWEEK(R.START_DTTM) = YEARWEEK(NOW())
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
    if(rows.affectedRows > 0) return "예약 성공"
    else return "예약 불가"
}