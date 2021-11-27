import React from "react";
import { View, Text, Dimensions } from "react-native";

interface Props {
  name: string;
}
export default function SectionHeader({ name }: Props) {
  return (
    <View
      style={{
        backgroundColor: "#333",
        width: Dimensions.get("window").width,
        height: 30,
        justifyContent: "center",
        paddingLeft: 12,
      }}
    >
      <Text
        style={{
          color: "white",
          fontWeight: "bold",
          fontFamily: "Avenir",
          fontSize: 15,
        }}
      >
        {name}
      </Text>
    </View>
  );
}
