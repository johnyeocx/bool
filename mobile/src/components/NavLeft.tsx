import React from "react";
import { Image, View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemeContext } from "../ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";

export const NavLeft = ({ route, navigation, source }: any) => {
  const theme = React.useContext(ThemeContext);
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
      <View style={styles.imageContainer}>
        <FastImage style={styles.image} source={{ uri: source }} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    display: "flex",
    position: "absolute",
    left: 35,
    bottom: -12,
    width: 28,
    height: 28,
    marginBottom: 20,
    borderRadius: 20,
  },
  image: {
    width: 28,
    height: 28,
    borderRadius: 20,
  },
});
