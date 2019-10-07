import {getUser,getAllMeetingRoom,getReservation,getMeetingRoom,addReservation} from "./common"

const resolvers = {
    Query: {
        reservation_list: () => getReservation(),
        meeting_room_list: (_,{START_DTTM,END_DTTM}) => getMeetingRoom(START_DTTM,END_DTTM)
    },
    Reservation: {
        IDX: o => o.IDX,
        USER_ID: o => o.USER_ID,
        USER: o => getUser(o.USER_ID),
        ROOM_ID: o => o.ROOM_ID,
        ROOM: o => getAllMeetingRoom(o.ROOM_ID),
        START_DTTM: o => o.START_DTTM,
        END_DTTM: o => o.END_DTTM
    },
    Mutation: {
        addReservation: (_,{USER_ID,ROOM_ID,START_DTTM,END_DTTM}) => addReservation(USER_ID,ROOM_ID,START_DTTM,END_DTTM)
    }
}

export default resolvers