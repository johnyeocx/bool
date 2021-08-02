import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation } from "@apollo/client";
import { User } from "../../../../types/types";
import { GET_EVENTS } from "../../../../gql/mutations";
import { useDispatch } from "react-redux";
import { GET_USER_1, ADD_USERS_TO_EVENT } from "../../../../gql/mutations";

interface AddFriendProps {
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  modalVisible: boolean;
  members: Array<string>;
  myself: User;
  eventId: string;
}

function AddFriend({
  modalVisible,
  setModalVisible,
  members,
  myself,
  eventId,
}: AddFriendProps) {
  const [friends, setFriends] = useState<Array<User>>([]);
  const [isEditable, setIsEditable] = useState<Array<boolean>>([]);
  const [isAdded, setIsAdded] = useState<Array<boolean>>([]);
  const [getFriends] = useMutation(GET_USER_1, {
    onError(err) {
      console.log(err);
    },
  });
  const [getEvents] = useMutation(GET_EVENTS, {
    onError: (err) => console.log(err),
  });
  const [addToEvent] = useMutation(ADD_USERS_TO_EVENT, {
    onError(err) {
      console.log(err);
    },
  });
  const dispatch = useDispatch();
  const areYouSure = () => {
    Alert.alert("Are you sure you want to add: ", "robinczm", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Yes", onPress: () => addButtonClicked() },
    ]);
  };

  const addButtonClicked = async () => {
    let toAdd = [];

    for (let i = 0; i < friends.length; i++) {
      if (isAdded[i]) {
        toAdd.push(friends[i].username);
        let array = [...isEditable];
        array[i] = !array[i];
        setIsEditable(array);
      }
    }

    const { data } = await addToEvent({
      variables: {
        input: {
          eventId: eventId,
          usernames: toAdd,
        },
      },
    });

    if (data.addUsersToEvent != 0 && data.addUsersToEvent != -1) {
      dispatch({ type: "ADD_MEMBERS", payload: toAdd });
    }
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    renderFriends();
    return () => {};
  }, []);

  const renderFriends = async () => {
    const { data } = await getFriends({
      variables: { userIds: myself.friendships },
    });
    if (data && data.getUsers) {
      setFriends(data.getUsers);
      data.getUsers.map((user: User) => {
        if (members.includes(user.username)) {
          setIsAdded((isAdded) => [...isAdded, false]);
          setIsEditable((isEditable) => [...isEditable, false]);
        } else {
          setIsAdded((isAdded) => [...isAdded, false]);
          setIsEditable((isEditable) => [...isEditable, true]);
        }
      });
    }
  };

  const toggleAdded = (index: number) => {
    let array = [...isAdded];
    array[index] = !array[index];
    setIsAdded(array);
  };

  const renderItem = ({ item, index }: any) => {
    return (
      <View>
        <Pressable
          style={styles.cellContainer}
          onPress={
            isEditable[index]
              ? () => toggleAdded(index)
              : () => console.log("not editable")
          }
        >
          <View style={styles.cellLeft}>
            <Image style={styles.userImage} source={{ uri: item.profileImg }} />
            <Text style={styles.userName}>{item.username}</Text>
          </View>
          <View style={styles.cellRight}>
            {isEditable[index] ? (
              <View style={styles.editableContainer}>
                {isAdded[index] && <View style={styles.addedIndicator} />}
              </View>
            ) : (
              <View>
                <Text style={styles.addedText}>Added</Text>
              </View>
            )}
          </View>
        </Pressable>
        <View style={styles.inset}></View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}></View>
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Friends</Text>
          <TouchableOpacity onPress={areYouSure}>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          contentContainerStyle={{
            width: Dimensions.get("window").width,
            justifyContent: "flex-end",
          }}
          data={friends}
          renderItem={renderItem}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          bounces={false}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity
          style={{ position: "absolute", right: 20, bottom: 40 }}
          onPress={() => setModalVisible(!modalVisible)}
        >
          <MaterialIcons name="cancel" size={40} color="#f46" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mainContainer: {
    flex: 7,
    backgroundColor: "#222",
    width: Dimensions.get("window").width,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 20,
  },
  headerContainer: {
    backgroundColor: "#333",
    width: "100%",
    height: "5%",
    borderTopLeftRadius: 15,
    paddingHorizontal: 20,
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
    fontSize: 15,
    fontWeight: "bold",
    color: "#f46",
  },
  imageContainer: {
    display: "flex",
    width: 150,
    height: 150,
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
  editableContainer: {
    height: 26,
    width: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  addedIndicator: {
    backgroundColor: "white",
    height: 18,
    width: 18,
    borderRadius: 10,
  },
  addedText: {
    fontFamily: "Futura",
    fontSize: 14,
    fontWeight: "700",
    color: "#ccc",
  },
  inset: {
    width: Dimensions.get("window").width - 10,
    height: 3,
    alignSelf: "flex-end",
    backgroundColor: "#333",
  },
});

export default AddFriend;
