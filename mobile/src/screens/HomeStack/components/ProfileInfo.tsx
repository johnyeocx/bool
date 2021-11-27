// EXTERNAL
import * as React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import FastImage from "react-native-fast-image";

// INTERNAL
import { myColor } from "../../../apollo/cache";

export const ProfileInfo = ({ myself }: any) => {
  return (
    <View
      style={{
        height: 150,
        width: Dimensions.get("window").width,
        flexDirection: "row",
      }}
    >
      {/* LEFT WRAPPER */}
      <View style={styles.overallWrapper}>
        <View
          style={{
            paddingLeft: 45,
          }}
        >
          {/* USERNAME TEXT */}
          <Text
            style={styles.usernameText}
          >{`${myself.username.toUpperCase()}`}</Text>
          {/* BIO TEXT */}
          <Text style={styles.bioText} numberOfLines={2}>
            songs from the bedroom of mediocrity
          </Text>

          {/* BOOLS/FRIEDNS WRAPPER */}
          <View
            style={{
              flexDirection: "row",
            }}
          >
            {/* COUNT WRAPPER */}
            <View style={{ justifyContent: "center" }}>
              <Text style={styles.countText}>102</Text>
              <Text style={styles.countText}>2005</Text>
            </View>
            {/* TEXT WRAPPER */}
            <View>
              <Text style={styles.boolText}>
                {"  "}
                Bools
              </Text>
              <Text style={styles.boolText}>
                {"  "}
                Friends
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* RIGHT WRAPPER */}
      <View style={styles.rightWrapper}>
        <View style={styles.imageWrapper}>
          <FastImage
            style={{
              flex: 1,
              borderRadius: 50,
            }}
            source={{ uri: myself.profileImg }}
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overallWrapper: {
    flex: 1,
    paddingBottom: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  usernameText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 5,
  },
  bioText: {
    color: "white",
    fontSize: 12,
    marginBottom: 5,
  },
  countText: {
    color: "white",
    fontSize: 15,
  },
  boolText: {
    fontSize: 15,
    color: `${myColor()}`,
    fontWeight: "bold",
  },
  rightWrapper: {
    flex: 1,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderStyle: "solid",
    borderWidth: 3,
    borderColor: `${myColor()}`,
  },
});
