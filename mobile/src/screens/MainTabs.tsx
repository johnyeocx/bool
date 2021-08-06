import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "./HomeStack/Home/HomeScreen";
import CreateEventScreen from "./CreateStack/ActivityScreen";
import AuthScreen from "./AuthStack/AuthScreen";
import SearchScreen from "./SearchStack/SearchScreen";
import { View, Text } from "react-native";
import { Ionicons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/core";
import MyStack from "./HomeStack/Stack/HomeStack.tsx";
import ChatScreen from "./ChatStack/ChatScreen";
import CreateStack from "./CreateStack/Stack/CreateStack";
import GroupScreen from "./CreateStack/GroupScreen";
import HomeStack from "./HomeStack/Stack/HomeStack.tsx";

const screenOptions = (
  route: RouteProp<Record<string, object | undefined>, string>,
  color: string
) => {
  switch (route.name) {
    case "Home":
      return <Ionicons name="ios-home" size={20} color={color} />;
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
          backgroundColor: "#222",
          height: 70,
        },
        showLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Create" component={CreateStack} />
      <Tab.Screen name="Auth" component={AuthScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
    </Tab.Navigator>
  );
};

export default Tabs;
