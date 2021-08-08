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
import NavHeader from "../../components/NavHeader";
import { NavLeft } from "../../components/NavLeft";
import { ReactNativeFile } from "apollo-upload-client";
// import * as ImagePicker from "expo-image-picker";
import FriendsList from "./FriendsList";
import { FETCH_USERS } from "../../gql/queries/userQueries";
import { useQuery, useReactiveVar } from "@apollo/client";
import { User } from "../../types/types";
import { myself, newGroup } from "../../apollo/cache";
import { Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import SectionHeader from "../../components/SectionHeader";
import ImagePicker, { ImageOrVideo } from "react-native-image-crop-picker";

const CustomHeaderRight = ({ navigation }: any) => {
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        paddingRight: 10,
      }}
      onPress={() => {
        console.log("Creating new group: ", newGroup());
        navigation.goBack();
      }}
    >
      <Text style={{ color: "#f46", fontFamily: "Avenir", fontSize: 16 }}>
        Create
      </Text>
    </TouchableOpacity>
  );
};

export default function CreateGroup({ navigation, route }: any) {
  // STATE
  const [image, setImage] = useState<ReactNativeFile | null>(null);
  const input = useRef(null);
  const [friendsModalVisible, setFriendsModalVisible] = useState(false);
  const [friends, setFriends] = useState<Array<User>>([]);
  const [chosenMembers, setChosenMembers] = useState<Array<User>>([myself()!]);
  useReactiveVar(newGroup);

  // LAYOUT
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <NavHeader name="New Group" />,
      headerStyle: {
        height: 80,
        backgroundColor: "#222",
      },
      headerLeft: () => (
        <NavLeft route={route} navigation={navigation} source={null} />
      ),
      headerRight: () => <CustomHeaderRight navigation={navigation} />,
    });
  }, [navigation]);

  // QUERIES
  const { loading, error, data } = useQuery(FETCH_USERS, {
    variables: { userIds: myself()!.friendships },
    onCompleted: (data) => {
      console.log("FETCH RESULT: ", data.users);
      setFriends(data.users);
    },
  });

  // CLICKS
  const handleImgWrapperClicked = async () => {
    // const pickPicture = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then((image) => {
      console.log(image);
      const file = new ReactNativeFile({
        uri: image.path,
        name: image.filename,
        type: image.mime,
      });
      setImage(file);
      newGroup({ ...newGroup(), image: file });
    });
  };

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
          members={chosenMembers}
          setMembers={setChosenMembers}
        />
      </Modal>

      {/* SECTION 1 */}
      <View style={{ height: 150 }}>
        <SectionHeader name="Details" />
        <View
          style={{
            width: Dimensions.get("window").width,
            flex: 10,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "flex-start",
              paddingLeft: 12,
              width: 100,
              height: 50,
            }}
            onPress={handleImgWrapperClicked}
          >
            <Image
              style={{ width: 70, height: 70, borderRadius: 20 }}
              source={
                image
                  ? { uri: image.uri }
                  : {
                      uri: "https://icon-library.com/images/no-profile-picture-icon/no-profile-picture-icon-13.jpg",
                    }
              }
            />
          </TouchableOpacity>
          {/* CELL RIGHT */}
          <View style={{ flex: 2 }}>
            <View
              style={{
                flex: 0.5,
                justifyContent: "flex-end",
                paddingBottom: 12,
                // backgroundColor: "red",
              }}
            >
              <TextInput
                style={{
                  color: "white",
                  marginLeft: 10,
                  fontSize: 15,
                  borderRadius: 5,
                }}
                ref={input}
                autoCapitalize="none"
                placeholder="Name"
                placeholderTextColor="#ddd"
                multiline
                value={newGroup().name}
                onChange={(e) => {
                  newGroup({ ...newGroup(), name: e.nativeEvent.text });
                }}
              />
            </View>
            {/* <View
              style={{
                flex: 0.5,
                height: 50,
                justifyContent: "flex-start",
              }}
            >
              <TextInput
                style={{
                  color: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 10,
                  borderRadius: 5,
                }}
                ref={input}
                autoCapitalize="none"
                placeholder="Description"
                placeholderTextColor="#ddd"
                multiline
                value={newGroup().description}
                onChange={(e) => {
                  newGroup({ ...newGroup(), description: e.nativeEvent.text });
                }}
              />
            </View> */}
          </View>
        </View>
      </View>

      <SectionHeader name="Members" />

      <View
        style={{
          height: 50,
          // backgroundColor: "red",
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
        data={chosenMembers}
        renderItem={renderItem}
        bounces={false}
        keyExtractor={(item, index: number) => {
          return index.toString();
        }}
        showsVerticalScrollIndicator={false}
        // ListFooterComponent={Remove}
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
