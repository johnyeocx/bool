// EXTERNAL
import * as React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

// ICONS
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

// INTERNAL
import { myColor, myself } from "../../../../apollo/cache";
import FastImage from "react-native-fast-image";

export const UserSettingsHeader = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.overallWrapper}>
      {/* LEFT BUTTON (MENU) */}
      <TouchableOpacity
        onPress={() => {
          navigation.pop();
        }}
      >
        <View style={styles.backWrapper}>
          <Feather name="chevron-left" size={28} color={`${myColor()}`} />
          <View
            style={{
              width: 23,
              height: 23,
              borderStyle: "solid",
              borderWidth: 2,
              borderColor: myColor(),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 12.5,
            }}
          >
            <FastImage
              source={{ uri: myself()?.profileImg }}
              style={{
                width: 21,
                height: 21,
                borderRadius: 12.5,
              }}
            ></FastImage>
          </View>
        </View>
      </TouchableOpacity>

      {/* RIGHT BUTTON (EDIT PAGE) */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("UserSettings");
        }}
      >
        <View style={styles.rightWrapper}>
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
  backWrapper: {
    height: 36,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  rightWrapper: {
    width: 36,
    height: 36,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
