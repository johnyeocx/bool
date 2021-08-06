import * as React from "react";
import { useEffect } from "react";
import { Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Tabs from "../../MainTabs";

import { ThemeContext } from "../../../ThemeProvider";
import NavHeader from "../../../components/NavHeader";
import GroupScreen from "../GroupScreen";
import ActivityScreen from "../ActivityScreen";
import CreateGroup from "../CreateGroup";
import { myself } from "../../../apollo/cache";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

function CreateStack() {
  const theme = React.useContext(ThemeContext);
  const getSelf = async () => {
    const result = await AsyncStorage.getItem("user");
    if (result) {
      myself(JSON.parse(result));
    }
  };

  useEffect(() => {
    getSelf();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          height: 80,
          backgroundColor: theme.colors.backgroundPrimary,
        },
        headerTitle: () => <NavHeader name="Create" />,
      }}
    >
      <Stack.Screen name="Create" component={GroupScreen} />
      <Stack.Screen name="New Group" component={CreateGroup} />
      <Stack.Screen name="Activity" component={ActivityScreen} />
    </Stack.Navigator>
  );
}

export default CreateStack;
