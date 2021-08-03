import { InMemoryCache } from "@apollo/client";
import { makeVar } from "@apollo/client";
import { User } from "../types/types";

// state things
export const currentMembers = makeVar<Array<User>>([]);

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        currentMembers: {
          read() {
            return currentMembers();
          },
        },
      },
    },
    User: {
      keyFields: ["username"],
    },
  },
});
