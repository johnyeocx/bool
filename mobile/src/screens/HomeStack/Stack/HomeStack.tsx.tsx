// EXTERNAL
import * as React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native-gesture-handler";

// INTERNAL
import { HomeHeader } from "../components/HomeHeader";
import HomeScreen from "../Home/HomeScreen";
import { ThemeContext } from "../../../ThemeProvider";
import EventTabs from "../Event/Tabs/EventTabs";
import EventSettings from "../Event/InfoScreen/EventSettings";

const Stack = createStackNavigator();

function MyStack() {
  const theme = React.useContext(ThemeContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          height: 86,
          backgroundColor: "#111",
        },
        headerTitle: () => <HomeHeader />,
      }}
    >
      <Stack.Screen name="Main" component={HomeScreen} />
      <Stack.Screen name="Event" component={EventTabs} />
      <Stack.Screen name="Settings" component={EventSettings} />
      {/* <Stack.Screen name="Create" component={ActivityScreen} /> */}
    </Stack.Navigator>
  );
}

export default MyStack;
