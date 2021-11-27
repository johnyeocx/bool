import React, { useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { Switch } from "react-native-gesture-handler";
import { myself } from "../../../apollo/cache";
import SectionHeader from "../../../components/SectionHeader";
import { User } from "../../../types/types";
import ActivityScreen from "../components/ActivityScreen";
import DetailsContainer from "../components/DetailsContainer";
import CreateGroup from "../CreateGroup";

export default function CreatePlan({ chosenMembers, setChosenMembers }: any) {
  const [allowPolling, setAllowPolling] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: "#222" }}>
      <View>
        <DetailsContainer />
        <SectionHeader name="Details" />
        <View
          style={{
            height: 50,
            width: Dimensions.get("screen").width,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 12,
          }}
        >
          <Text style={{ color: "white", fontSize: 15 }}>Finalized Event</Text>
          <Switch
            style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
            trackColor={{ false: "black", true: "#444" }}
            thumbColor={allowPolling ? "white" : "#888"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setAllowPolling(!allowPolling)}
            value={allowPolling}
          />
        </View>
      </View>
      <View style={{ flex: 1, backgroundColor: "green" }}>
        <ActivityScreen isFixed={allowPolling} />
        <CreateGroup />
      </View>
    </View>
  );
}
