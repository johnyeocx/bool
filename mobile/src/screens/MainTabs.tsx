import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "./HomeStack/Home/HomeScreen";
import CreateEventScreen from "./CreateStack/components/ActivityScreen";
import AuthScreen from "./AuthStack/AuthScreen";
import SearchScreen from "./SearchStack/SearchScreen";
import { View, Text } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/core";
import ChatScreen from "./ChatStack/ChatScreen";
import CreateStack from "./CreateStack/Stack/CreateStack";
import HomeStack from "./HomeStack/Stack/HomeStack.tsx";
import { myColor, myself } from "../apollo/cache";
import FastImage from "react-native-fast-image";

const screenOptions = (
  route: RouteProp<Record<string, object | undefined>, string>,
  color: string
) => {
  switch (route.name) {
    case "Home":
      return (
        <View
          style={{
            width: 25,
            height: 25,
            backgroundColor: "red",
            borderStyle: "solid",
            borderWidth: 2,
            borderColor: color,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 12.5,
          }}
        >
          <FastImage
            source={{ uri: myself()?.profileImg }}
            style={{
              width: 23,
              height: 23,
              borderRadius: 12.5,
            }}
          ></FastImage>
        </View>
      );

    // <Ionicons name="ios-home" size={20} color={color} />;
    case "Chat":
      return <Ionicons name="chatbubble" size={20} color={color} />;
    case "Create":
      return <FontAwesome name="plus-square" size={20} color={color} />;
    case "Auth":
      return <Ionicons name="person-add" size={20} color={color} />;
    case "Search":
      return <Ionicons name="ios-search" size={20} color={color} />;
  }
};

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => screenOptions(route, color),
      })}
      tabBarOptions={{
        style: {
          backgroundColor: "#111",
          height: 74,
        },
        activeTintColor: myColor(),
        inactiveTintColor: "lightgray",
        showLabel: false,
      }}
    >
      <Tab.Screen name="Auth" component={AuthScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Create" component={CreateStack} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Home" component={HomeStack} />
    </Tab.Navigator>
  );
};

export default Tabs;
