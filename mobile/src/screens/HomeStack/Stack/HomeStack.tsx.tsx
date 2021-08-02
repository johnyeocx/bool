import * as React from "react";
import { Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Tabs from "../../MainTabs";
import EventSettings from "../Event/InfoScreen/EventSettings";
import EventTabs from "../Event/Tabs/EventTabs";
import { ThemeContext } from "../../../ThemeProvider";

const Stack = createStackNavigator();

function MyStack() {
  const theme = React.useContext(ThemeContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.backgroundPrimary,
        },
        headerTitleStyle: {
          color: theme.colors.textPrimary,
        },
      }}
    >
      <Stack.Screen name="Home" component={Tabs} />
      <Stack.Screen name="Event" component={EventTabs} />
      <Stack.Screen name="Settings" component={EventSettings} />
    </Stack.Navigator>
  );
}

export default MyStack;
