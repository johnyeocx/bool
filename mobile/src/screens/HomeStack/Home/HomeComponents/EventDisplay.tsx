import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  Dimensions,
  FlatList,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment";
import { useDispatch } from "react-redux";
import FastImage from "react-native-fast-image";

const formatData = (events: any, numColumns: any) => {
  const numberOfFullRows = Math.floor(events.length / numColumns);
  let numberOfElementsLastRow = events.length - numberOfFullRows * numColumns;
  while (
    numberOfElementsLastRow !== numColumns &&
    numberOfElementsLastRow !== 0
  ) {
    events.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow = numberOfElementsLastRow + 1;
  }
  return events;
};

const formatDate = (eventDateString: string) => {
  return moment(eventDateString).format("DD MMM YYYY");
};

const EventDisplay = ({ navigation, myself, events }: any) => {
  const dispatch = useDispatch();
  const renderItem = ({ item }: any) => {
    if (item.empty === true) {
      return <View style={styles.itemInvisible}></View>;
    }
    return (
      <TouchableOpacity
        onPress={() => {
          // console.log("TO EVENT PAGE", item);
          navigation.navigate("Event");
          dispatch({
            type: "SET_CURRENT_EVENT",
            payload: item,
          });
        }}
      >
        <FastImage
          source={{ uri: item.eventDP }}
          style={styles.imageBackground}
          // imageStyle={{ borderRadius: 15 }}
        >
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        </FastImage>
      </TouchableOpacity>
    );
  };
  const numColumns = 2;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}
    >
      <FlatList
        data={formatData(events, numColumns)}
        renderItem={renderItem}
        numColumns={2}
        style={{
          width: Dimensions.get("window").width,
        }}
        columnWrapperStyle={{
          flex: 1,
          justifyContent: "space-evenly",
          marginTop: 20,
        }}
      />
    </View>
  );
};

export default EventDisplay;

const styles = StyleSheet.create({
  itemInvisible: {
    backgroundColor: "transparent",
  },
  imageBackground: {
    width: 180,
    height: 120,
    justifyContent: "flex-end",
    paddingBottom: 10,
    paddingLeft: 5,
    borderRadius: 15,
  },
  nameText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
  },
});
