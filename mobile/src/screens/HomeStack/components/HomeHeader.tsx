// EXTERNAL
import * as React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

// ICONS
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// INTERNAL
import { myColor } from "../../../apollo/cache";

export const HomeHeader = () => {
  return (
    <View style={styles.overallWrapper}>
      {/* LEFT BUTTON (MENU) */}
      <TouchableOpacity
        onPress={() => {
          console.log("Hello World");
        }}
      >
        <View style={styles.iconWrapper}>
          <Entypo name="menu" size={28} color={`${myColor()}`} />
        </View>
      </TouchableOpacity>

      {/* RIGHT BUTTON (EDIT PAGE) */}
      <TouchableOpacity
        onPress={() => {
          console.log("hello world");
        }}
      >
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name="pencil-circle"
            size={28}
            color={`${myColor()}`}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  overallWrapper: {
    height: 36,
    width: Dimensions.get("window").width,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
