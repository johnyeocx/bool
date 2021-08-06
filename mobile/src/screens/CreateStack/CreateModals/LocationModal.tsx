import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_API } from "../../../constants/constants";

interface LocationModalProps {
  modalVisible: boolean;
  setModalVisible: any;
  activities: {
    activity: string;
    location: string;
  }[];
  setActivities: React.Dispatch<
    React.SetStateAction<
      {
        activity: string;
        location: string;
      }[]
    >
  >;
  activityIndex: number;
}
export default function LocationModal({
  modalVisible,
  setModalVisible,
  activityIndex,
  activities,
  setActivities,
}: LocationModalProps) {
  const [locationSelection, setLocationSelection] = useState("");
  return (
    <View style={{ flex: 1, backgroundColor: "#222" }}>
      <View style={{ flex: 0.1 }}></View>
      <View
        style={{
          backgroundColor: "#333",
          width: "100%",
          height: "5%",
          paddingHorizontal: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            fontFamily: "Futura",
            fontSize: 16,
            fontWeight: "bold",
            color: "white",
          }}
        >
          Select Location
        </Text>
        <TouchableOpacity
          onPress={() => {
            let array = [...activities];
            array[activityIndex].location = locationSelection;
            setActivities(array);
            setModalVisible(!modalVisible);
          }}
        >
          <Text
            style={{
              fontFamily: "Futura",
              fontSize: 15,
              fontWeight: "bold",
              color: "#f46",
            }}
          >
            Confirm
          </Text>
        </TouchableOpacity>
      </View>
      <GooglePlacesAutocomplete
        placeholder="Search"
        textInputProps={{
          placeholderTextColor: "gray",
        }}
        onPress={(data, details = null) => {
          setLocationSelection(data.description);
        }}
        query={{
          key: GOOGLE_API,
          language: "en",
        }}
        styles={{
          textInputContainer: {
            backgroundColor: "#121212",
            height: 38,
          },
          textInput: {
            height: 38,
            backgroundColor: "#121212",
            color: "white",
            fontSize: 16,
          },
          row: {
            backgroundColor: "#111",
            padding: 13,
            height: 44,
            flexDirection: "row",
          },
          listView: {
            color: "white",
          },
          separator: {
            height: 0.5,
            backgroundColor: "#333",
          },
          description: {
            color: "white",
          },
          poweredContainer: {
            backgroundColor: "#222",
            justifyContent: "flex-end",
            alignItems: "center",
            borderBottomRightRadius: 5,
            borderBottomLeftRadius: 5,
            borderColor: "#c8c7cc",
            borderTopWidth: 0.5,
          },
          powered: {
            color: "white",
          },
        }}
      />
    </View>
  );
}
