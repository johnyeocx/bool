import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import React from "react";
import MyStack from "./HomeStack/Stack/HomeStack.tsx";
import { ThemeProvider } from "../ThemeProvider";

import Tabs from "./MainTabs";
import MainStack from "./MainStack";
import { myself } from "../apollo/cache";

const DarkTheme = {
  dark: true,
  colors: {
    primary: "rgb(255, 45, 85)",
    background: "rgb(242, 242, 242)",
    card: "rgb(255, 255, 255)",
    text: "rgb(28, 28, 30)",
    border: "rgb(199, 199, 204)",
    notification: "rgb(255, 69, 58)",
  },
};

const RootNavigator = () => {
  return (
    <ThemeProvider>
      <NavigationContainer theme={DarkTheme}>
        {/* <MyStack /> */}
        <MainStack />
        {/* <Tabs /> */}
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default RootNavigator;
