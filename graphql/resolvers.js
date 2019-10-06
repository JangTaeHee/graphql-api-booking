import {getReservation,getMeetingRoom,addReservation} from "./common"

const resolvers = {
    Query: {
        reservation_list: () => getReservation(),
        meeting_room_list: (_,{START_DTTM,END_DTTM}) => getMeetingRoom(START_DTTM,END_DTTM)
    },
    Mutation: {
        addReservation: (_,{USER_ID,ROOM_ID,START_DTTM,END_DTTM}) => addReservation(USER_ID,ROOM_ID,START_DTTM,END_DTTM)
    }
}

export default resolvers