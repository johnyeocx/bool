import * as React from "react";
import { Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
// import Tabs from "../../MainTabs";
// import EventSettings from "../Event/InfoScreen/EventSettings";
// import EventTabs from "../Event/Tabs/EventTabs";
import { ThemeContext } from "../ThemeProvider";
import NavHeader from "../components/NavHeader";
import ActivityScreen from "./CreateStack/components/ActivityScreen";
import Tabs from "./MainTabs";

const Stack = createStackNavigator();

function MainStack() {
  // const theme = React.useContext(ThemeContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={Tabs} />
      <Stack.Screen name="Event" component={ActivityScreen} />
    </Stack.Navigator>
  );
}

export default MainStack;
