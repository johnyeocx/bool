import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ActivityScreen from "./CreateStack/components/ActivityScreen";
import Tabs from "./MainTabs";
import Chat from "./HomeStack/Event/EventScreen/Chat/Chat";
import { UserSettingsHeader } from "./HomeStack/UserSettings/UScomponents/USHeader";
import EventChatHeader from "./HomeStack/Event/EventScreen/Chat/EventChatHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { myself } from "../apollo/cache";

const Stack = createStackNavigator();

function MainStack() {
  React.useEffect(() => {
    getSelf();
  }, []);

  const getSelf = async () => {
    const result = await AsyncStorage.getItem("user");
    if (result) {
      //  setMyself(JSON.parse(result));
    }
  };

  return (
    <Stack.Navigator
    // screenOptions={{
    //   headerShown: false,
    // }}
    >
      <Stack.Screen
        name="Main"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Event" component={ActivityScreen} />
      <Stack.Screen
        name="EventChat"
        component={Chat}
        options={{
          headerLeft: () => null,
          headerStyle: {
            height: 86,
            backgroundColor: "#111",
          },
          headerTitle: () => <EventChatHeader />,
        }}
      />
    </Stack.Navigator>
  );
}

export default MainStack;
