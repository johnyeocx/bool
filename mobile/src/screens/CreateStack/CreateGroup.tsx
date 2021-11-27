import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
// import * as ImagePicker from "expo-image-picker";
import FriendsList from "./components/FriendsList";
import { FETCH_USERS } from "../../gql/queries/userQueries";
import { useQuery, useReactiveVar } from "@apollo/client";
import { User } from "../../types/types";
import { myself, newGroup, chosenMembers } from "../../apollo/cache";
import { Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import SectionHeader from "../../components/SectionHeader";

export default function CreateGroup() {
  const members = useReactiveVar(chosenMembers);
  // STATE
  const [friendsModalVisible, setFriendsModalVisible] = useState(false);
  const [friends, setFriends] = useState<Array<User>>([]);
  console.log(chosenMembers());

  // QUERIES
  useQuery(FETCH_USERS, {
    variables: { userIds: myself()!.friendships },
    onCompleted: (data) => {
      console.log("FETCH RESULT: ", data.users);
      setFriends(data.users);
    },
  });

  // RENDERS
  const renderItem = ({ item, index }: any) => {
    return (
      <View>
        <Pressable style={styles.cellContainer}>
          <View style={styles.cellLeft}>
            <FastImage
              style={styles.userImage}
              source={{
                uri: item.profileImg,
                priority: FastImage.priority.normal,
              }}
            />
            <Text style={styles.userName}>
              {item.username === myself()!.username ? "You" : item.username}
            </Text>
          </View>
          <View style={styles.cellRight}></View>
        </Pressable>
        <View style={styles.inset}></View>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#212121",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={friendsModalVisible}
        onRequestClose={() => {
          setFriendsModalVisible(!friendsModalVisible);
        }}
      >
        <FriendsList
          modalVisible={friendsModalVisible}
          setModalVisible={setFriendsModalVisible}
          friends={friends}
        />
      </Modal>

      <SectionHeader name="Members" />

      <View
        style={{
          height: 50,
          width: Dimensions.get("screen").width,
          justifyContent: "center",
          paddingLeft: 10,
        }}
      >
        <Pressable
          onPress={() => setFriendsModalVisible(!friendsModalVisible)}
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="add-circle-outline"
            size={20}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text
            style={{
              color: "white",
            }}
          >
            Add Members
          </Text>
        </Pressable>
      </View>
      <FlatList
        contentContainerStyle={{
          width: Dimensions.get("window").width,
          justifyContent: "flex-end",
        }}
        data={chosenMembers()}
        renderItem={renderItem}
        bounces={false}
        keyExtractor={(item, index: number) => {
          return index.toString();
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  cellContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    backgroundColor: "#121212",
  },
  cellLeft: {
    flex: 3.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 13,
  },
  userImage: {
    width: 42,
    height: 42,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontFamily: "Futura",
    fontSize: 15,
    color: "white",
  },
  cellRight: {
    flex: 1,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inset: {
    width: Dimensions.get("window").width - 10,
    height: 3,
    alignSelf: "flex-end",
    backgroundColor: "#222",
  },
});
