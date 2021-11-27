import * as React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Pressable,
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { Event, User } from "../../../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../../redux/reducers/eventsSlice";
import { RootState } from "../../../redux/reducers/reducer";
import { GET_EVENTS } from "../../../gql/mutations";
import { FlatList } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import { myColor } from "../../../apollo/cache";

import { ProfileInfo } from "../components/ProfileInfo";

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [eventIds, setEventIds] = useState<Array<string>>([]);
  const [isChat, setIsChat] = useState(false);
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

  const renderPlans = () => {
    return (
      <View style={{ flex: 1 }}>
        <Text>{`Chat `}</Text>
      </View>
    );
  };

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

  const renderItem = ({ item, index }: any) => {
    return (
      <View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            height: 100,
          }}
          onPress={() => {
            dispatch({ type: "SET_CURRENT_EVENT", payload: item });
            navigation.navigate("Event", {
              event: item,
              myself: myself,
              name: item.name,
            });
          }}
        >
          <View style={{ width: 100, alignItems: "center" }}>
            <Image
              style={{
                width: 70,
                height: 70,
                borderRadius: 20,
                marginRight: 10,
              }}
              source={{ uri: item.eventDP }}
            />
          </View>
          <View
            style={{
              width: 300,
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ fontFamily: "Futura", fontSize: 20, color: "white" }}
            >
              {item.name}
            </Text>

            <Text
              style={{ fontFamily: "Futura", fontSize: 15, color: "white" }}
            >
              {item.date}
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            width: Dimensions.get("window").width - 10,
            height: 3,
            alignSelf: "flex-end",
            backgroundColor: "#333",
          }}
        />
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#111",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <ProfileInfo myself={myself} />

      <View
        style={{
          height: 30,
          backgroundColor: "#333",
          width: Dimensions.get("window").width,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Pressable onPress={() => setIsChat(!isChat)}>
          <Text
            style={{
              fontFamily: "Futura",
              color: "white",
              fontSize: 15,
              fontWeight: "bold",
            }}
          >
            Events
          </Text>
        </Pressable>
        <Pressable onPress={() => setIsChat(!isChat)}>
          <Text
            style={{
              fontFamily: "Futura",
              color: "white",
              fontSize: 15,
              fontWeight: "bold",
            }}
          >
            Plans
          </Text>
        </Pressable>
      </View>
      <View style={styles.eventsWrapper}>
        <FlatList
          contentContainerStyle={{
            justifyContent: "flex-end",
          }}
          data={events ? events : null}
          renderItem={isChat ? renderPlans : renderItem}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          bounces={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  eventsWrapper: {
    flex: 2.5,
    height: 600,
    width: 400,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  userImageContainer: {
    flex: 2,
    height: 100,
    borderRadius: 50,
  },
  imageContainer: {
    display: "flex",
    width: 100,
    height: 100,
    backgroundColor: "red",
    marginBottom: 20,
    borderRadius: 20,
  },
  eventImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  userImage: {
    width: 42,
    height: 42,
    borderRadius: 20,
    marginRight: 10,
  },
});

export default HomeScreen;
