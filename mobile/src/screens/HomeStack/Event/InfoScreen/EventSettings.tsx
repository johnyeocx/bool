import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  Image,
  Pressable,
  Dimensions,
  Platform,
  TextInput,
} from "react-native";
import { Event, User } from "../../../../types/types";
import AddFriend from "./AddFriend";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/reducers/reducer";
import { GET_UPLOAD_URL, GET_USER_1 } from "../../../../gql/mutations";
import { useMutation } from "@apollo/client";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ReactNativeFile } from "apollo-upload-client";
import {
  CHANGE_DETAILS,
  CHANGE_DISPLAY,
} from "../../../../gql/mutations/eventMutations";
import { uploadImage } from "../../../../helpers/photos";
import NavHeader from "../../../../components/NavHeader";
import FastImage from "react-native-fast-image";
import { currentMembers } from "../../../../apollo/cache";
import { NavLeft } from "../../../../components/NavLeft";

interface EventSettingProps {
  navigation: any;
  route: any;
  event: Event;
}

function EventSettings({ navigation, route }: EventSettingProps) {
  const [friends, setFriends] = useState<Array<User>>([]);
  const [getFriends] = useMutation(GET_USER_1, {
    onError(err) {
      console.log(err);
    },
  });
  const dispatch = useDispatch();
  const event = useSelector((state: RootState) => state.currentEvent);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        height: 80,
        backgroundColor: "#222",
      },
      headerTitleStyle: { color: "white" },
      headerTitle: () => <NavHeader name="Edit" />,
      headerLeft: () => (
        <NavLeft route={route} navigation={navigation} source={event.eventDP} />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const [title, setTitle] = useState(event.name);
  const [description, setDescription] = useState(event.description);
  const [modalVisible, setModalVisible] = useState(false);

  const [getUrl] = useMutation(GET_UPLOAD_URL, {
    onError(err) {
      console.log(err);
    },
  });
  const [changeDisplay] = useMutation(CHANGE_DISPLAY, {
    onError(err) {
      console.log(err);
    },
  });
  const [changeDetails] = useMutation(CHANGE_DETAILS, {
    onError(err) {
      console.log(err);
    },
  });
  const [file, setFile] = useState<ReactNativeFile | null>(null);

  const renderFriends = async () => {
    const { data } = await getFriends({
      variables: { userIds: route.params.myself.friendships },
    });
    if (data && data.getUsers) {
      setFriends(data.getUsers);
    }
  };

  useEffect(() => {
    renderFriends();
    return () => {};
  }, []);

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
              {item.username == route.params.myself.username
                ? "You"
                : item.username}
            </Text>
          </View>
          <View style={styles.cellRight}></View>
        </Pressable>
        <View style={styles.inset}></View>
      </View>
    );
  };

  const saveDetails = async () => {
    if (file) {
      console.log("uploading file");
      const { data } = await getUrl({
        variables: { input: event.id },
      });

      if (data) {
        console.log(data);
        const url = data.uploadPhoto;
        uploadImage(url[0], file.uri);
        const res = await changeDisplay({
          variables: {
            input: {
              eventId: event.id,
              photoUrl: url[1],
              oldUrl: event.eventDP,
            },
          },
        });
        if (res.data.changeDisplay == 0) {
          console.log("successfully changed display");
          dispatch({ type: "CHANGE_DISPLAY", payload: file.uri });
        }
        setFile(null);
      }
    }
    const res = await changeDetails({
      variables: {
        input: {
          eventId: event.id,
          name: title,
          description: description,
        },
      },
    });
    console.log(res);
    if (res.data.changeDetails == 0) {
      dispatch({
        type: "CHANGE_DETAILS",
        payload: {
          name: title,
          description: description,
        },
      });
    }
    navigation.pop();
  };

  const changeEventDP = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      aspect: [3, 3],
      quality: 1,
      crop: true,
    });

    if (!result.cancelled) {
      const file = new ReactNativeFile({
        uri: result.uri,
        name: "00_display",
        type: result.type,
      });
      setFile(file);
    }
  };

  return (
    <View style={styles.galleryContainer}>
      {/* Modal Container */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <AddFriend
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          members={event.members}
          myself={route.params.myself}
          eventId={event.id}
          friends={friends}
        />
      </Modal>

      {/* Event Image Container */}
      <View style={{ flex: 0.4, flexDirection: "row" }}>
        <View
          style={{
            flex: 1,
            // backgroundColor: "green",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={styles.eventDPContainer}>
            <Image
              style={styles.eventDP}
              source={file ? { uri: file.uri } : { uri: event.eventDP }}
            />
          </View>
        </View>
        <View style={{ flex: 2, justifyContent: "center", padding: 10 }}>
          <TextInput
            style={{
              color: "white",
              fontFamily: "Futura",
              marginBottom: 15,
              fontSize: 18,
            }}
            value={title}
            onChange={(e) => setTitle(e.nativeEvent.text)}
          />

          <TextInput
            style={{
              color: "white",
              fontFamily: "Futura",
              fontSize: 13,
            }}
            value={description}
            onChange={(e) => setDescription(e.nativeEvent.text)}
          />
        </View>

        <Pressable
          style={{ position: "absolute", right: 14, bottom: 10 }}
          onPress={() => {
            changeEventDP();
          }}
        >
          <Feather name="camera" size={20} color="white" />
        </Pressable>
        <Pressable
          style={{ position: "absolute", right: 14, top: 10 }}
          onPress={() => {
            saveDetails();
          }}
        >
          <Text style={{ color: "white", fontFamily: "Futura", fontSize: 15 }}>
            Save
          </Text>
        </Pressable>
      </View>

      {/* Members Container */}
      <View style={styles.membersTitleContainer}>
        <Text style={styles.title}>Members</Text>
        <TouchableOpacity>
          <Text
            style={styles.addText}
            onPress={() => setModalVisible(!modalVisible)}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        contentContainerStyle={{
          width: Dimensions.get("window").width,
          justifyContent: "flex-end",
        }}
        data={currentMembers()}
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
  galleryContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#222",
  },
  eventDPContainer: {
    backgroundColor: "red",
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    borderRadius: 20,
    // position: "relative",
  },
  eventDP: {
    display: "flex",
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  titleInput: {},
  descriptionInput: {},
  membersTitleContainer: {
    backgroundColor: "#333",
    width: "100%",
    height: "5%",
    paddingHorizontal: 15,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontFamily: "Futura",
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  addText: {
    fontFamily: "Futura",
    fontSize: 24,
    fontWeight: "bold",
    color: "#f46",
  },
  imageContainer: {
    display: "flex",
    width: 125,
    height: 125,
    backgroundColor: "red",
    marginBottom: 20,
    borderRadius: 20,
  },
  cellContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
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
    backgroundColor: "#333",
  },
});

export default EventSettings;
