import { StatusBar } from "expo-status-bar";
import * as React from "react";
import RootNavigator from "./src/screens/RootNavigator";
import { ApolloProvider } from "@apollo/client/react";
import store from "./src/redux/store/store";
import { Provider } from "react-redux";
import { client } from "./src/apollo/client";

export default function App() {
  // requestUserPermission()
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <StatusBar hidden />
        <RootNavigator />
      </Provider>
    </ApolloProvider>
  );
}
