import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  Button,
} from "react-native";
import { ReactNativeFile } from "apollo-upload-client";
import * as ImagePicker from "expo-image-picker";
import { TextInput } from "react-native-gesture-handler";
import DateModal from "../CreateModals/DateModal";
import LocationModal from "../CreateModals/LocationModal";
import NavHeader from "../../../components/NavHeader";
import { NavLeft } from "../../../components/NavLeft";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { newGroup } from "../../../apollo/cache";

type RootStackParamList = {
  Activity: undefined;
};

type ActivityScreenRouteProp = RouteProp<RootStackParamList, "Activity">;

type ActivityScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Activity"
>;

type ActivityProps = {
  route: ActivityScreenRouteProp;
  navigation: ActivityScreenNavigationProp;
};

const CustomHeaderRight = ({
  navigation,
  image,
  name,
  description,
  members,
}: any) => {
  console.log(newGroup());
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        paddingRight: 10,
      }}
      onPress={() => {}}
    >
      <Text style={{ color: "#f46", fontFamily: "Avenir", fontSize: 16 }}>
        Next
      </Text>
    </TouchableOpacity>
  );
};

const ActivityScreen = ({ isFixed }: any) => {
  // STATE
  const input = useRef(null);

  // DATE STUFF
  const [dates, setDates] = useState<Array<string>>(["Choose Date"]);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [dateIndex, setDateIndex] = useState(0);

  // ACTIVITY STUFF
  const [activities, setActivities] = useState([
    {
      activity: "",
      location: "Select Location",
    },
  ]);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [activityIndex, setActivityIndex] = useState(0);

  // CLICKS
  return (
    <View
      style={{
        // flex: 1,
        backgroundColor: "#212121",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {/* DATE MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={dateModalVisible}
        onRequestClose={() => {
          setDateModalVisible(!dateModalVisible);
        }}
      >
        <DateModal
          modalVisible={dateModalVisible}
          setModalVisible={setDateModalVisible}
          dates={dates}
          setDates={setDates}
          dateIndex={dateIndex}
        />
      </Modal>

      {/* LOCATION MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={activityModalVisible}
        onRequestClose={() => {
          setActivityModalVisible(!activityModalVisible);
        }}
      >
        <LocationModal
          modalVisible={activityModalVisible}
          setModalVisible={setActivityModalVisible}
          activities={activities}
          setActivities={setActivities}
          activityIndex={activityIndex}
        />
      </Modal>

      {/* SECTION 1 */}
      <View
        style={{
          // flex: 1,
          // backgroundColor: "red",
          width: Dimensions.get("window").width,
        }}
      >
        <View
          style={{
            backgroundColor: "#333",
            width: Dimensions.get("window").width,
            height: 30,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 12,
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontFamily: "Avenir",
              fontSize: 15,
            }}
          >
            Date
          </Text>
          {isFixed ? null : (
            <TouchableOpacity
              onPress={
                dates.length < 3
                  ? () => setDates([...dates, "Choose Date"])
                  : () => console.log("Max dates reached")
              }
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: "Avenir",
                  fontSize: 18,
                }}
              >
                +
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {dates.map((date: string, index: number) => {
          return (
            <View
              style={{
                height: 50,
                backgroundColor: "#222",
                justifyContent: "center",
                paddingLeft: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setDateIndex(index);
                  setDateModalVisible(!dateModalVisible);
                }}
              >
                <Text style={{ color: "white" }}>
                  {date ? date : "Choose Date"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* SECTION 3 */}
      <View
        style={{
          width: Dimensions.get("window").width,
        }}
      >
        <View
          style={{
            backgroundColor: "#333",
            width: Dimensions.get("window").width,
            height: 30,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 12,
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontFamily: "Avenir",
              fontSize: 15,
            }}
          >
            Activity
          </Text>
          {isFixed ? null : (
            <TouchableOpacity
              onPress={
                activities.length < 3
                  ? () =>
                      setActivities([
                        ...activities,
                        {
                          activity: "",
                          location: "Select Location",
                        },
                      ])
                  : () => console.log("Max activities reached")
              }
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: "Avenir",
                  fontSize: 18,
                }}
              >
                +
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {activities.map((activity: any, index: number) => {
          return (
            <View
              key={index}
              style={{
                height: 90,
                justifyContent: "center",
                paddingLeft: 12,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  paddingBottom: 12,
                  flex: 1,
                }}
              >
                <TextInput
                  style={{
                    color: "white",
                    fontSize: 15,
                  }}
                  ref={input}
                  autoCapitalize="none"
                  placeholder={`Activity ${index + 1}`}
                  placeholderTextColor="#ddd"
                  multiline
                  value={activity.activity}
                  onChange={(e) => {
                    let tmp = [...activities];
                    tmp[index].activity = e.nativeEvent.text;
                    setActivities(tmp);
                  }}
                />
              </View>
              <TouchableOpacity
                style={{
                  flex: 1,
                }}
                onPress={() => {
                  setActivityIndex(index);
                  setActivityModalVisible(!dateModalVisible);
                }}
              >
                <Text style={{ color: "white" }}>{activity.location}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      {/* <Text style={{ color: "white" }}>Members</Text> */}
    </View>
  );
};

export default ActivityScreen;
