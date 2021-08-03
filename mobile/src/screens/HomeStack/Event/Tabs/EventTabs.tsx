import React, { useEffect, useState } from "react";
import { View, Image, Button, Touchable } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/core";
import { useMutation } from "@apollo/client";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { RootState } from "../../../../redux/reducers/reducer";
import { Theme } from "../../../../types/themeTypes";
import { ThemeContext } from "../../../../ThemeProvider";
import { GET_USER_2 } from "../../../../gql/mutations";
import { currentMembers } from "../../../../apollo/cache";
import Chat from "../EventScreen/Chat/Chat";
import Gallery from "../EventScreen/Gallery/Gallery";
import { NavLeft } from "../../../../components/NavLeft";

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

const CustomHeader = ({ route, navigation, event }: any) => {
  const theme = React.useContext(ThemeContext);
  return (
    <TouchableOpacity
      style={styles(theme).switch}
      onPress={() => {
        navigation.navigate("Settings", {
          event: event,
          myself: route.params.myself,
        });
      }}
    >
      <Text style={styles(theme).eventName}>Event</Text>
    </TouchableOpacity>
  );
};

const EventTabs = ({ navigation, route }: EventTabsProps) => {
  const currentEvent = useSelector((state: RootState) => state.currentEvent);
  const isVisible = useIsFocused();
  const theme = React.useContext(ThemeContext);
  const [getMembers] = useMutation(GET_USER_2, {
    onError(err) {
      console.log(err);
    },
  });
  const renderMembers = async () => {
    const { data } = await getMembers({
      variables: { usernames: currentEvent.members },
    });

    if (data && data.getUsersByUsernames) {
      console.log(data);
      currentMembers(data.getUsersByUsernames);
    }
  };

  useEffect(() => {
    renderMembers();
  }, []);

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
      headerLeft: () => (
        <NavLeft
          route={route}
          navigation={navigation}
          source={route.params.myself.profileImg}
        />
      ),
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
