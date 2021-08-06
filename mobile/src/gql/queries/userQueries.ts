import { gql } from "@apollo/client";
export const FETCH_USERS = gql`
  query Users($userIds: [MongoID!]!) {
    users(userIds: $userIds) {
      id
      username
      profileImg
    }
  }
`;
// users(userIds: [MongoID!]!): [User!]!

export const GET_USER_2 = gql`
  mutation GetUsersByUsernames($usernames: [String!]!) {
    getUsersByUsernames(usernames: $usernames) {
      username
      profileImg
    }
  }
`;
