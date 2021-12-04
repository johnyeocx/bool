import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  View,
  SafeAreaView,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  Image,
} from "react-native";
import FastImage from "react-native-fast-image";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/reducers/reducer";
import EventInfo from "./EventComponents/EventInfo";
import Gallery from "react-native-image-gallery";
import GestureRecognizer from "react-native-swipe-gestures";
import MasonryList from "@react-native-seoul/masonry-list";
import { useQuery } from "@apollo/client";
import { FETCH_USERS, GET_USER_2 } from "../../../gql/queries/userQueries";
import { currentMembers } from "../../../apollo/cache";

const EventScreen = () => {
  const event = useSelector((state: RootState) => state.currentEvent);
  const [modalVisibleStatus, setModalVisibleStatus] = useState(false);
  const [selected, setSelected] = useState(0);
  const [photoDimensions, setPhotoDimensions] = useState<any>([]);

  const [dataSource, setDataSource] = useState(
    event.photos.map((photo: string) => {
      return {
        source: {
          uri: photo,
        },
      };
    })
  );

  const showModalFunction = (visible: boolean, imageURL: string) => {
    setModalVisibleStatus(visible);
  };

  const { loading, error, data } = useQuery(FETCH_USERS, {
    variables: { userIds: event.members },
    onCompleted: (data) => {
      console.log("FETCH RESULT: ", data.users);
      currentMembers(data.users);
    },
  });

  const renderPhotos = ({ item, i }: { item: any; i: string }) => {
    const randomBool = useMemo(() => Math.random() < 0.5, []);
    return (
      <View
        style={{
          flex: 1,
          marginVertical: 5,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            setSelected(parseInt(i));
            showModalFunction(true, item);
          }}
        >
          <FastImage
            style={{
              width: "100%",
              aspectRatio: 50 / 50,
            }}
            source={item.source ? item.source : { uri: item }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderPhoto = ({ image }: any) => {
    return (
      <View style={{ flex: 1 }}>
        <FastImage
          source={image.source}
          style={{ flex: 1 }}
          resizeMode="contain"
        ></FastImage>
      </View>
    );
  };

  const screen = Dimensions.get("window");
  const [scale, setScale] = useState(3);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#111",
      }}
    >
      <EventInfo event={event} />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "black",
        }}
      >
        {modalVisibleStatus ? (
          <GestureRecognizer
            style={{ flex: 1 }}
            onSwipeDown={() => showModalFunction(!modalVisibleStatus, "")}
          >
            <Modal
              transparent={false}
              animationType={"slide"}
              visible={modalVisibleStatus}
              onRequestClose={() => {
                showModalFunction(!modalVisibleStatus, "");
              }}
            >
              <View style={styles.modalStyle}>
                <Gallery
                  style={{ flex: 1, backgroundColor: "black" }}
                  initialPage={selected}
                  images={dataSource}
                  imageComponent={renderPhoto}
                />
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles.closeButtonStyle}
                  onPress={() => {
                    showModalFunction(!modalVisibleStatus, "");
                  }}
                >
                  <Text style={{ color: "red" }}>CLOSE</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </GestureRecognizer>
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
            }}
          >
            <MasonryList
              style={{ flex: 1, backgroundColor: "black" }}
              contentContainerStyle={{
                paddingHorizontal: 0,
              }}
              data={dataSource}
              renderItem={renderPhotos}
              numColumns={3}
            />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default EventScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  closeButtonStyle: {
    position: "absolute",
    top: 20,
    right: 20,
  },
});
