import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import * as SecureStore from "expo-secure-store";
import { A_TOKEN } from "../constants/constants";

export const authLink = setContext(async (_, { headers }) => {
  const token = await SecureStore.getItemAsync(A_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
    },
  };
});

export const httpLink = createUploadLink({
  uri: "http://localhost:8080/query",
});
