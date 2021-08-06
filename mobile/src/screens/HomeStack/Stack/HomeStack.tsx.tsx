import * as React from "react";
import { Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Tabs from "../../MainTabs";
import EventSettings from "../Event/InfoScreen/EventSettings";
import EventTabs from "../Event/Tabs/EventTabs";
import { ThemeContext } from "../../../ThemeProvider";
import NavHeader from "../../../components/NavHeader";
import ActivityScreen from "../../CreateStack/ActivityScreen";
import { currentScreenTitle } from "../../../apollo/cache";
import HomeScreen from "../Home/HomeScreen";

const Stack = createStackNavigator();

function MyStack() {
  const theme = React.useContext(ThemeContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          height: 80,
          backgroundColor: theme.colors.backgroundPrimary,
        },
        headerTitle: () => <NavHeader name="Home" />,
      }}
    >
      <Stack.Screen
        name="Main"
        component={HomeScreen}
        // options={{

        // }}
      />
      <Stack.Screen name="Event" component={EventTabs} />
      <Stack.Screen name="Settings" component={EventSettings} />
      {/* <Stack.Screen name="Create" component={ActivityScreen} /> */}
    </Stack.Navigator>
  );
}

export default MyStack;
