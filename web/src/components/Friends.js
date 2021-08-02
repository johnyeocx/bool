import React from "react";
import { useQuery, gql } from "@apollo/client";

const FRIENDSHIPS = gql`
  query UserFriendships($input: MongoID!) {
    userFriendships(userId: $input) {
      sourceName
      targetName
    }
  }
`;

const TO_ADD = gql`
  query FriendshipsToAdd($input: MongoID!) {
    friendshipsToAdd(userId: $input) {
      sourceName
      targetName
    }
  }
`;

const AWAITING_ADD = gql`
  query FriendshipsAwaitingAdd($input: MongoID!) {
    friendshipsAwaitingAdd(userId: $input) {
      sourceName
      targetName
    }
  }
`;

const Friends = () => {
  const response = useQuery(FRIENDSHIPS, {
    variables: { input: "60be2b3a20ec99a1a009b749" },
  });

  if (response) {
    console.log(response.data.userFriendships);
  }

  const response2 = useQuery(TO_ADD, {
    variables: { input: "60be2b3a20ec99a1a009b749" },
  });

  if (response2) {
    console.log(response2.data.friendshipsToAdd);
  }

  const response3 = useQuery(AWAITING_ADD, {
    variables: { input: "60be2b3a20ec99a1a009b749" },
  });

  if (response3) {
    console.log(response3.data.friendshipsAwaitingAdd);
  }
  return <div>Friends page</div>;
};

export default Friends;
