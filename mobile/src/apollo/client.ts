import { ApolloClient } from "@apollo/client";
import { authLink, httpLink } from "./link";
import { cache } from "./cache";

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});
