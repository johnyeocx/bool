import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "./HomeStack/Home/HomeScreen";
import CreateEventScreen from "./CreateStack/CreateEventScreen";
import AuthScreen from "./AuthStack/AuthScreen";
import SearchScreen from "./SearchStack/SearchScreen";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/core";
import MyStack from "./HomeStack/Stack/HomeStack.tsx";

const screenOptions = (
  route: RouteProp<Record<string, object | undefined>, string>,
  color: string
) => {
  switch (route.name) {
    case "Home":
      return <Ionicons name="ios-home" size={24} color={color} />;
    case "Create":
      return <Ionicons name="ios-create-outline" size={24} color={color} />;
    case "Auth":
      return <Ionicons name="person-add" size={24} color={color} />;
    case "Search":
      return <Ionicons name="ios-search" size={24} color={color} />;
  }
};

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => screenOptions(route, color),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Create" component={CreateEventScreen} />
      <Tab.Screen name="Auth" component={AuthScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
    </Tab.Navigator>
  );
};

export default Tabs;
