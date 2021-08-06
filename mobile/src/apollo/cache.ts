import { InMemoryCache, ReactiveVar } from "@apollo/client";
import { makeVar } from "@apollo/client";
import { Image } from "react-native";
import { User } from "../types/types";
import { ReactNativeFile } from "apollo-upload-client";

// state things
export const currentMembers = makeVar<Array<User>>([]);
export const currentScreenTitle = makeVar<string>("temp");
export const myself = makeVar<User | null>({
  id: "",
  username: "",
  email: "",
  profileImg: "",
  friendships: [],
  events: [],
  settingsId: "",
});

export const newGroup: ReactiveVar<{
  name: string;
  description: string;
  image: ReactNativeFile;
  members: Array<string>;
}> = makeVar({
  name: "",
  description: "",
  image: new ReactNativeFile({
    uri: "https://icon-library.com/images/no-profile-picture-icon/no-profile-picture-icon-13.jpg",
    name: "default",
    type: "jpeg",
  }),
  members: [""],
});

export const currentCreation = makeVar({
  groupId: "",
});

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        currentMembers: {
          read() {
            return currentMembers();
          },
        },
        currentScreenTitle: {
          read() {
            return currentScreenTitle();
          },
        },
        myself: {
          read() {
            return myself();
          },
        },
      },
    },
    // User: {
    //   keyFields: ["username"],
    // },
  },
});
