import {ApolloServer, gql} from "apollo-server"
import responseCachePlugin from 'apollo-server-plugin-response-cache'
import resolvers from "./graphql/resolvers"

const typeDefs = gql`
    scalar Date

    type Reservation @cacheControl(maxAge: 240){
        IDX: Int!
        USER_ID: String!
        USER_NM: String!
        DEPARTMENT: String!
        ROOM_ID: String!
        ROOM_NM: String!
        START_DTTM: Date!
        END_DTTM: Date!
    }

    type MeetingRoom @cacheControl(maxAge: 240){
        ID: String!
        NAME: String!
        SIZE: Int!
    }


    type Query{
        reservation_list: [Reservation]! @cacheControl(maxAge: 10)
        meeting_room_list(START_DTTM:Date!,END_DTTM:Date!): [MeetingRoom]! @cacheControl(maxAge: 10)
    }

    type Mutation {
        addReservation(USER_ID:String!,ROOM_ID:String!,START_DTTM:Date!,END_DTTM:Date!): String!
    }
`

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [responseCachePlugin()],
    cacheControl: {
        defaultMaxAge: 5,
    }
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });