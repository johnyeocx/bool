import * as React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { Event, User } from "../../../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../../redux/reducers/eventsSlice";
import { RootState } from "../../../redux/reducers/reducer";
import { GET_EVENTS } from "../../../gql/mutations";

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [eventIds, setEventIds] = useState<Array<string>>([]);
  const [myself, setMyself] = useState<User>();
  const [getEvents] = useMutation(GET_EVENTS, {
    onError: (err) => console.log(err),
  });

  const isVisible = useIsFocused();
  const dispatch = useDispatch();
  const events = useSelector((state: RootState) => state.events);

  const renderedEvents = events.map((event: Event) => {
    return (
      <TouchableOpacity
        onPress={() => {
          dispatch({ type: "SET_CURRENT_EVENT", payload: event });
          navigation.navigate("Event", {
            event: event,
            myself: myself,
            name: event.name,
          });
        }}
        style={styles.imageContainer}
        key={event.id}
      >
        <Image style={styles.eventImage} source={{ uri: event.eventDP }} />
      </TouchableOpacity>
    );
  });

  useEffect(() => {
    getSelf();
    const fetchEventsThunk = fetchEvents(myself, getEvents);
    dispatch(fetchEventsThunk);
  }, [isVisible]);

  useEffect(() => {
    if (myself) {
      setEventIds(myself.events);
    }
  }, [myself]);

  const getSelf = async () => {
    const result = await AsyncStorage.getItem("user");
    if (result) {
      setMyself(JSON.parse(result));
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 100,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          marginBottom: 30,
        }}
      >
        {myself ? `${myself.username.toUpperCase()}` : "NOT SIGNED IN"}
      </Text>
      <View style={styles.eventsWrapper}>{renderedEvents}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  eventsWrapper: {
    height: 600,
    width: 400,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  imageContainer: {
    display: "flex",
    width: 150,
    height: 150,
    backgroundColor: "red",
    marginBottom: 20,
    borderRadius: 20,
  },
  eventImage: {
    width: 150,
    height: 150,
    borderRadius: 20,
  },
});

export default HomeScreen;
