import { Theme } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Item } from "react-native-paper/lib/typescript/components/List/List";
import { myColor } from "../../../../../apollo/cache";
import StyleSheetFactory from "./styles";

interface MessagesProp {
  messages: Array<any>;
  username: string;
}
interface renderItemProps {
  item: any;
}

function Messages({ messages, username }: MessagesProp) {
  let styles;
  const renderItem = ({ item }: renderItemProps) => {
    if (item.sender == username) {
      styles = StyleSheetFactory.getSheet(true);
    } else {
      styles = StyleSheetFactory.getSheet(false);
    }

    return (
      <View
        style={{
          borderStyle: "solid",
          borderWidth: 2,
          borderColor: item.sender == username ? `${myColor()}` : "#7122fa",
          padding: 10,
          borderRadius: 25,
          marginTop: 5,
          maxWidth: "60%",
          alignSelf: item.sender == username ? "flex-end" : "flex-start",
        }}
      >
        <Text style={{ fontWeight: "bold", color: "white" }}>
          {item.sender}:
        </Text>
        <Text style={{ color: "white" }}>{item.body}</Text>
      </View>
    );
  };
  return (
    <FlatList
      contentContainerStyle={{
        width: Dimensions.get("window").width,
        padding: 20,
        justifyContent: "flex-end",
      }}
      data={messages}
      renderItem={renderItem}
      keyExtractor={(item, index) => {
        return index.toString();
      }}
      bounces={false}
      showsVerticalScrollIndicator={false}
      inverted
    />
  );
}

export default Messages;
