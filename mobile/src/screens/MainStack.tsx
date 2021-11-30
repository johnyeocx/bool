import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ActivityScreen from "./CreateStack/components/ActivityScreen";
import Tabs from "./MainTabs";

const Stack = createStackNavigator();

function MainStack() {
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
