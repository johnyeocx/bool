import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../ThemeProvider";
import { Theme } from "../types/themeTypes";

export default function NavHeader({ name }: any) {
  const theme = React.useContext(ThemeContext);
  return (
    <View style={styles(theme).switch}>
      <Text style={styles(theme).eventName}>Edit</Text>
    </View>
  );
}

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
  });
