import { gql, useMutation } from "@apollo/client";

export const GET_EVENTS = gql`
  mutation EventsFromIds($eventIds: [String!]!) {
    eventsFromIds(eventIds: $eventIds) {
      id
      name
      date
      description
      photos
      eventDP
      members
    }
  }
`;

export const GET_USER_1 = gql`
  mutation GetUsers($userIds: [MongoID!]!) {
    getUsers(userIds: $userIds) {
      username
      profileImg
    }
  }
`;

export const GET_USER_2 = gql`
  mutation GetUsersByUsernames($usernames: [String!]!) {
    getUsersByUsernames(usernames: $usernames) {
      username
      profileImg
    }
  }
`;

export const ADD_USERS_TO_EVENT = gql`
  mutation AddUsersToEvent($input: AddUsersToEvent!) {
    addUsersToEvent(input: $input)
  }
`;

export const GET_UPLOAD_URL = gql`
  mutation UploadPhoto($input: String!) {
    uploadPhoto(input: $input)
  }
`;
