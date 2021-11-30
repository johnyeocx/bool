import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
} from "react-native";
import FastImage from "react-native-fast-image";
import { myColor, myself } from "../../../apollo/cache";
// import * as ImagePicker from "expo-image-picker";
import { ReactNativeFile } from "apollo-upload-client";
import ImagePicker from "react-native-image-crop-picker";

const UserSettings = ({ navigation }: any) => {
  const [theme, setTheme] = useState<string>(myColor());
  const [file, setFile] = useState<ReactNativeFile | null>(null);
  const [username, setUsername] = useState<string | undefined>(
    myself()!.username
  );
  const [quote, setQuote] = useState<string | undefined>(
    "songs from the bedroom of mediocrity"
  );

  useEffect(() => {
    const file = new ReactNativeFile({
      uri: myself()?.profileImg!,
      name: myself()?.username,
      type: "image/jpeg",
    });
    setFile(file);
  }, []);

  const handleImgWrapperClicked = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true,
    }).then((image) => {
      if (image == null) return;
      const file = new ReactNativeFile({
        uri: image.path,
        name: myself()?.username,
        type: image.mime,
      });
      setFile(file);
    });
  };

  const renderItem = ({
    item,
  }: {
    item: {
      color: string;
      id: string;
    };
  }) => (
    <View
      style={{
        marginVertical: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setTheme(item.color);
        }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            backgroundColor: `${item.color}`,
            borderRadius: 10,
          }}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#111",
      }}
    >
      {/* EDIT PHOTO */}
      <View>
        <View
          style={{
            height: 160,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <View
            style={{
              width: 94,
              height: 94,
              borderStyle: "solid",
              borderWidth: 2,
              borderColor: theme,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 94 / 2,
              marginBottom: 10,
            }}
          >
            <FastImage
              style={styles.profileImg}
              source={
                file
                  ? { uri: file.uri }
                  : {
                      uri: "https://icon-library.com/images/no-profile-picture-icon/no-profile-picture-icon-13.jpg",
                    }
              }
            />
          </View>
          <TouchableOpacity onPress={handleImgWrapperClicked}>
            <Text
              style={{
                color: theme,
                fontWeight: "500",
              }}
            >
              Edit Photo
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* USERNAME */}
      <View style={styles.block}>
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            marginBottom: 6,
          }}
        >
          USERNAME
        </Text>
        <TextInput
          style={{
            color: "white",
          }}
          placeholder={myself()!.username}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      {/* BIO */}
      <View style={styles.block}>
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            marginBottom: 6,
          }}
        >
          QUOTE
        </Text>
        <TextInput
          style={{
            color: "white",
          }}
          value={quote}
          onChangeText={setQuote}
          numberOfLines={1}
          maxLength={50}
        />
      </View>

      {/* THEME COLOR */}
      <View style={styles.block2}>
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            marginBottom: 6,
          }}
        >
          THEME:
        </Text>
        <View
          style={{
            height: 80,
            width: 200,
          }}
        >
          <FlatList
            data={[
              { color: "#ff5cd3", id: "1" },
              { color: "#ffcc00", id: "2" },
              { color: "#a3e877", id: "3" },
              { color: "#5ccdff", id: "4" },
              { color: "#ff5c5c", id: "5" },
              { color: "#ff945c", id: "6" },
            ]}
            renderItem={renderItem}
            numColumns={3}
            style={{
              flex: 1,
            }}
            columnWrapperStyle={{
              flex: 1,
              justifyContent: "space-evenly",
            }}
            keyExtractor={(item) => item.id}
          ></FlatList>
        </View>
      </View>

      {/* SAVE */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: 40,
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          style={{
            width: 200,
            height: 30,
            borderStyle: "solid",
            borderWidth: 2,
            borderColor: theme,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            myColor(theme);
            // logic to update username etc.

            navigation.pop();
          }}
        >
          <Text
            style={{
              color: theme,
              fontWeight: "500",
              fontSize: 15,
            }}
          >
            SAVE
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserSettings;

const styles = StyleSheet.create({
  imageContainer: {
    display: "flex",
    width: 90,
    height: 90,
    backgroundColor: "green",
  },
  profileImg: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  block: {
    justifyContent: "flex-start",
    alignItems: "center",
    height: 70,
  },
  block2: {
    justifyContent: "center",
    alignItems: "center",
  },
});
