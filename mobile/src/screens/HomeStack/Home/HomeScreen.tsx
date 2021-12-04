// EXTERNAL
import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { SimpleLineIcons } from "@expo/vector-icons";

// INTERNAL
import { Event, User } from "../../../types/types";
import { fetchEvents } from "../../../redux/reducers/eventsSlice";
import { RootState } from "../../../redux/reducers/reducer";
import { GET_EVENTS } from "../../../gql/mutations";
import { ProfileInfo } from "./HomeComponents/ProfileInfo";
import CreateEvent from "../../CreateStack/Tabs/CreateEvent";
import EventDisplay from "./HomeComponents/EventDisplay";
import { myself } from "../../../apollo/cache";

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [eventIds, setEventIds] = useState<Array<string>>([]);
  const [myself2, setMyself] = useState<User>();
  const [getEvents] = useMutation(GET_EVENTS, {
    onError: (err) => console.log(err),
  });

  const isVisible = useIsFocused();
  const dispatch = useDispatch();
  const events = useSelector((state: RootState) => state.events);

  useEffect(() => {
    getSelf();
    const fetchEventsThunk = fetchEvents(myself2, getEvents);
    dispatch(fetchEventsThunk);
  }, [isVisible]);

  useEffect(() => {
    if (myself2) {
      setEventIds(myself2.events);
    }
  }, [myself2]);

  const getSelf = async () => {
    const result = await AsyncStorage.getItem("user");
    if (result) {
      setMyself(JSON.parse(result));
      myself(JSON.parse(result));
    }
  };

  // TAB BAR WORKINGS
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "First" },
    { key: "second", title: "Second" },
  ]);
  const [render, setRender] = useState(false);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "white" }}
      style={{ backgroundColor: "#222" }}
      renderIcon={({ route, focused, color }) => (
        <SimpleLineIcons
          name={route.key == "first" ? "notebook" : "event"}
          size={18}
          color={color}
        />
      )}
      renderLabel={({ route, focused, color }) => null}
      // renderLabel={({ route, focused, color }) => (
      //   <Text
      //     style={
      //       focused
      //         ? {
      //             color: "white",
      //             fontWeight: "bold",
      //             fontSize: 14,
      //           }
      //         : {
      //             color: "grey",
      //             fontWeight: "bold",
      //             fontSize: 14,
      //           }
      //     }
      //   >
      //     {route.key == "first" ? "Events" : "Plans"}
      //   </Text>
      // )}
    />
  );

  const eventScreen = () => (
    <EventDisplay navigation={navigation} myself={myself} events={events} />
  );

  const renderScene = SceneMap({
    first: eventScreen,
    second: CreateEvent,
  });

  // MAIN
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#111",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {myself2 ? <ProfileInfo myself={myself2} /> : null}
      <View
        style={{
          flex: 1,
          height: 300,
          width: Dimensions.get("window").width,
        }}
      >
        <TabView
          style={{
            backgroundColor: "transparent",
            width: Dimensions.get("screen").width,
          }}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          transitionStyle="curl"
        />
      </View>
    </View>
  );
};

export default HomeScreen;
