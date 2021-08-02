import { Theme } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Item } from "react-native-paper/lib/typescript/components/List/List";
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
      <View style={styles.imageContainer}>
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

// const styles = (isSender: boolean, theme: Theme) =>
//   StyleSheet.create({
//     imageContainer: {
//       borderStyle: "solid",
//       borderWidth: 2,
//       borderColor: isSender ? "#ff2281" : "#7122fa",
//       padding: 10,
//       borderRadius: 25,
//       marginTop: 5,
//       maxWidth: "60%",
//       alignSelf: isSender ? "flex-end" : "flex-start",
//     },
//   });
export default Messages;
