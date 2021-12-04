import { InMemoryCache, ReactiveVar } from "@apollo/client";
import { makeVar } from "@apollo/client";
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

export const chosenMembers: ReactiveVar<Array<User | null>> = makeVar([
  myself(),
]);

export const currentCreation = makeVar({
  groupId: "",
});

// THEME COLOR
export const myColor: any = makeVar("#ffcc00");

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        myColor: {
          read() {
            return myColor();
          },
        },
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

        // CREATE EVENT
        chosenMembers: {
          read() {
            return chosenMembers();
          },
        },
      },
    },
  },
});
