import React, { useState } from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import DatePicker from "react-native-date-picker";
import moment from "moment";

interface DateModalProps {
  modalVisible: boolean;
  setModalVisible: any;
  dates: Array<string>;
  setDates: React.Dispatch<Array<string>>;
  dateIndex: number;
}
export default function DateModal({
  modalVisible,
  setModalVisible,
  dateIndex,
  dates,
  setDates,
}: DateModalProps) {
  const [dateSelection, setDateSelection] = useState<Date>(new Date());
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 8 }}></View>
      <View
        style={{
          backgroundColor: "#333",
          width: "100%",
          height: "5%",
          paddingHorizontal: 20,
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
          Date
        </Text>
        <TouchableOpacity
          onPress={() => {
            const date = moment(dateSelection).format("MMMM Do YYYY, dddd");
            let array = [...dates];
            array[dateIndex] = date;
            setDates(array);
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
      <View
        style={{
          flex: 3,
          backgroundColor: "#222",
          width: Dimensions.get("window").width,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <DatePicker
          date={dateSelection}
          onDateChange={setDateSelection}
          mode={"date"}
          textColor="#fff"
        />
      </View>
    </View>
  );
}
