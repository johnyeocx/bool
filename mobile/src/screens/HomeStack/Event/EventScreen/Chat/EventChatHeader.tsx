// EXTERNAL
import * as React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

// ICONS
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// INTERNAL
import { myColor, myself } from "../../../../../apollo/cache";
import FastImage from "react-native-fast-image";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "../../../../../redux/reducers/reducer";
import { useSelector } from "react-redux";

const EventChatHeader = () => {
  const event = useSelector((state: RootState) => state.currentEvent);
  const navigation = useNavigation();
  return (
    <View style={styles.overallWrapper}>
      {/* LEFT BUTTON (MENU) */}
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
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
              source={{ uri: event.eventDP }}
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
      </View>
    </View>
  );
};

export default EventChatHeader;

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
