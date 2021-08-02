import { StatusBar } from "expo-status-bar";
import * as React from "react";
import RootNavigator from "./src/screens/RootNavigator";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";
import * as SecureStore from "expo-secure-store";
import { A_TOKEN } from "./src/constants/constants";
import store from "./src/redux/store/store";
import { Provider } from "react-redux";

// Apollo Set Up
const authLink = setContext(async (_, { headers }) => {
  const token = await SecureStore.getItemAsync(A_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
    },
  };
});
const httpLink = createUploadLink({
  uri: "http://localhost:8080/query",
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <StatusBar hidden />
        <RootNavigator />
      </Provider>
    </ApolloProvider>
  );
}
