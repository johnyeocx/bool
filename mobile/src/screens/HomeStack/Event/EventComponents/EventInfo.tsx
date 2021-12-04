import { gql } from "@apollo/client";
import moment from "moment";
import React from "react";
import { View, Text, Dimensions, ImageBackground } from "react-native";
import FastImage from "react-native-fast-image";
import { Event } from "../../../../types/types";

const EventInfo = ({ event }: { event: Event }) => {
  return (
    <View
      style={{
        width: Dimensions.get("window").width,
        height: 200,
        backgroundColor: "green",
      }}
    >
      <FastImage
        style={{
          flex: 1,
          justifyContent: "flex-end",
        }}
        source={{ uri: event.eventDP }}
        resizeMode={FastImage.resizeMode.cover}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          <View
            style={{
              flex: 1,
              paddingLeft: 10,
              justifyContent: "center",
              height: 50,
            }}
          >
            {/* NAME AND DESCRIPTION */}
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                {event.name}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "white",
                }}
              >
                {event.description}
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              justifyContent: "center",
              height: 50,
              paddingRight: 10,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: "white",
                fontSize: 17,
              }}
            >
              {moment(event.date).format("DD MMM 'YY")}
            </Text>
          </View>
        </View>
      </FastImage>
    </View>
  );
};

export default EventInfo;
