import React, { useState } from "react";
import { View, Text } from "react-native";
import SectionHeader from "../../../components/SectionHeader";

export default function CreateEvent() {
  return (
    <View style={{ flex: 1, backgroundColor: "#222" }}>
      <View>
        <Text style={{ color: "white" }}>New Event</Text>
      </View>
    </View>
  );
}
