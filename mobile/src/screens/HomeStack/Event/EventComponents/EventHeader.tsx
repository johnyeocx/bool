// EXTERNAL
import * as React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

// ICONS
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// INTERNAL
import { myColor, myself } from "../../../../apollo/cache";
import FastImage from "react-native-fast-image";

export const EventHeader = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.overallWrapper}>
      {/* LEFT BUTTON (MENU) */}
      <TouchableOpacity
        onPress={() => {
          // navigation.pop();
          navigation.navigate("Profile");
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
      <View style={styles.rightWrapper}>
        <TouchableOpacity
          onPress={() => {
            console.log("add photos");
          }}
          style={{
            marginLeft: 12,
          }}
        >
          <Ionicons
            name="add-circle-outline"
            size={25}
            color={`${myColor()}`}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginLeft: 12,
          }}
          onPress={() => {
            console.log("view information");
            navigation.navigate("EventSettings");
          }}
        >
          <MaterialIcons name="event-note" size={25} color={`${myColor()}`} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginLeft: 12,
          }}
          onPress={() => {
            navigation.navigate("EventChat");
            console.log("go to chat");
          }}
        >
          <Ionicons
            name="chatbubble-outline"
            size={24}
            color={`${myColor()}`}
          />
        </TouchableOpacity>
      </View>
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
    height: 36,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
