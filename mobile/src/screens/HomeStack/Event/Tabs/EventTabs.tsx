import React, { useEffect } from "react";
import { View, Image, Button, Touchable } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/core";
import Chat from "../EventScreen/Chat/Chat";
import Gallery from "../EventScreen/Gallery/Gallery";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/reducers/reducer";
import { Theme } from "../../../../types/themeTypes";
import { ThemeContext } from "../../../../ThemeProvider";

const screenOptions = (
  route: RouteProp<Record<string, object | undefined>, string>,
  color: string
) => {
  switch (route.name) {
    case "Gallery":
      return <Ionicons name="ios-home" size={24} color={color} />;
    case "Chat":
      return <Ionicons name="ios-create-outline" size={24} color={color} />;
  }
};
interface EventTabsProps {
  navigation: any;
  route: any;
}

const Tab = createBottomTabNavigator();

const CustomHeader = ({ route, navigation, event, setEvent }: any) => {
  const theme = React.useContext(ThemeContext);
  return (
    <TouchableOpacity
      style={styles(theme).switch}
      onPress={() => {
        navigation.navigate("Settings", {
          event: event,
          setEvent: setEvent,
          myself: route.params.myself,
        });
      }}
    >
      <Text style={styles(theme).eventName}>Event</Text>
    </TouchableOpacity>
  );
};

export const HeaderBack = ({ route, navigation }: any) => {
  const theme = React.useContext(ThemeContext);
  console.log(route.params.myself);
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        alignContent: "center",
        justifyContent: "flex-start",
        paddingLeft: 12,
        flexDirection: "row",
      }}
      onPress={() => navigation.goBack()}
    >
      <Ionicons name="chevron-back" size={24} color="#f46" />
      <View style={styles(theme).userImageContainer}>
        <Image
          style={styles(theme).userImage}
          source={{ uri: route.params.myself.profileImg }}
        />
      </View>
    </TouchableOpacity>
  );
};

const EventTabs = ({ navigation, route }: EventTabsProps) => {
  const currentEvent = useSelector((state: RootState) => state.currentEvent);
  const isVisible = useIsFocused();
  const theme = React.useContext(ThemeContext);

  useEffect(() => {
    if (isVisible) {
    }
  }, [isVisible]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <CustomHeader
          event={currentEvent}
          route={route}
          navigation={navigation}
        />
      ),
      headerStyle: {
        height: 80,
        backgroundColor: "#222",
      },
      headerLeft: () => <HeaderBack route={route} navigation={navigation} />,
    });
  }, [navigation]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => screenOptions(route, color),
      })}
    >
      <Tab.Screen name="Gallery">
        {() => (
          <Gallery
            username={route.params.myself.username}
            event={route.params.event}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Chat">
        {() => (
          <Chat
            username={route.params.myself.username}
            event={route.params.event}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    switch: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
    },
    eventName: {
      color: theme.colors.textPrimary,
      fontSize: 17,
      fontFamily: "Avenir-Black",
    },
    userImageContainer: {
      display: "flex",
      position: "absolute",
      left: 35,
      bottom: -12,
      width: 28,
      height: 28,
      marginBottom: 20,
      borderRadius: 20,
    },
    userImage: {
      width: 28,
      height: 28,
      borderRadius: 20,
    },
  });

export default EventTabs;
