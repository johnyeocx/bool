import * as React from "react";
import { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { Item } from "react-native-paper/lib/typescript/components/List/List";
import { Event } from "../../../../../types/types";

interface EventProps {
  username: string;
  event: Event;
}

interface itemProps {
  item: string;
}

function Gallery({ event, username }: EventProps) {
  // const [username, setUsername] = useState("");

  const renderItem = ({ item }: itemProps) => {
    return (
      <View style={styles.imageContainer}>
        <Image style={styles.eventImage} source={{ uri: item }} />
      </View>
    );
  };
  return (
    <View style={styles.galleryContainer}>
      <FlatList
        data={event.photos}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        bounces={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  galleryContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#222",
  },
  eventName: {
    fontSize: 20,
  },
  imageContainer: {
    display: "flex",
    width: 300,
    height: 300,
    backgroundColor: "black",
    marginVertical: 20,
    borderRadius: 20,
  },
  eventImage: {
    width: 300,
    height: 300,
    borderRadius: 20,
  },
});

export default Gallery;
