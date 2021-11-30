// EXTERNAL
import * as React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native-gesture-handler";

// INTERNAL
import { HomeHeader } from "../Home/HomeComponents/HomeHeader";
import HomeScreen from "../Home/HomeScreen";
import { ThemeContext } from "../../../ThemeProvider";
import EventTabs from "../Event/Tabs/EventTabs";
import EventSettings from "../Event/InfoScreen/EventSettings";
import UserSettings from "../UserSettings/UserSettings";
import { UserSettingsHeader } from "../UserSettings/UScomponents/USHeader";

const Stack = createStackNavigator();

function MyStack({ navigation }: { navigation: any }) {
  const theme = React.useContext(ThemeContext);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={HomeScreen}
        options={{
          headerStyle: {
            height: 86,
            backgroundColor: "#111",
          },
          headerTitle: () => <HomeHeader navigation={navigation} />,
        }}
      />
      <Stack.Screen name="Event" component={EventTabs} />
      <Stack.Screen name="EventSettings" component={EventSettings} />
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
      {/* <Stack.Screen name="Create" component={ActivityScreen} /> */}
    </Stack.Navigator>
  );
}

export default MyStack;
