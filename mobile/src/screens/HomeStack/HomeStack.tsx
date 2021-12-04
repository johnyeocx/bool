// EXTERNAL
import * as React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native-gesture-handler";

// INTERNAL
import { HomeHeader } from "./Home/HomeComponents/HomeHeader";
import HomeScreen from "./Home/HomeScreen";
import { ThemeContext } from "../../ThemeProvider";
import EventTabs from "./Event/Tabs/EventTabs";
import EventSettings from "./Event/InfoScreen/EventSettings";
import UserSettings from "./UserSettings/UserSettings";
import { UserSettingsHeader } from "./UserSettings/UScomponents/USHeader";
import EventScreen from "./Event/EventScreen";
import { EventHeader } from "./Event/EventComponents/EventHeader";
import Chat from "./Event/EventScreen/Chat/Chat";
import EventSettingsHeader from "./Event/InfoScreen/EventSettingsHeader";

const Stack = createStackNavigator();

function MyStack({ navigation }: { navigation: any }) {
  const theme = React.useContext(ThemeContext);
  return (
    <Stack.Navigator>
      {/* HOME SCREEN */}
      <Stack.Screen
        name="Profile"
        component={HomeScreen}
        options={{
          headerStyle: {
            height: 86,
            backgroundColor: "#111",
          },
          headerTitle: () => <HomeHeader navigation={navigation} />,
        }}
      />

      {/* EVENT SCREEN */}
      <Stack.Screen
        name="Event"
        component={EventScreen}
        options={{
          headerLeft: () => null,
          headerStyle: {
            height: 86,
            backgroundColor: "#111",
          },
          headerTitle: () => <EventHeader navigation={navigation} />,
        }}
      />

      <Stack.Screen
        name="EventSettings"
        component={EventSettings}
        options={{
          headerLeft: () => null,
          headerStyle: {
            height: 86,
            backgroundColor: "#111",
          },
          headerTitle: () => <EventSettingsHeader />,
        }}
      />

      {/* USER SETTING SCREEN */}
      <Stack.Screen
        name="UserSettings"
        component={UserSettings}
        options={{
          headerLeft: () => null,
          headerStyle: {
            height: 86,
            backgroundColor: "#111",
          },
          headerTitle: () => <UserSettingsHeader navigation={navigation} />,
        }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{
          headerLeft: () => null,
          headerStyle: {
            height: 86,
            backgroundColor: "#111",
          },
          headerTitle: () => <UserSettingsHeader navigation={navigation} />,
        }}
      />
      {/* <Stack.Screen name="Create" component={ActivityScreen} /> */}
    </Stack.Navigator>
  );
}

export default MyStack;
