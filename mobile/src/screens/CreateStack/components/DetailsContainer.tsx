import { useReactiveVar } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";
import React, { useRef, useState } from "react";
import {
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { newGroup } from "../../../apollo/cache";

export default function DetailsContainer() {
  const [image, setImage] = useState<ReactNativeFile | null>(null);
  const input = useRef(null);
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

  const group = useReactiveVar(newGroup);
  return (
    <View>
      <View style={{ height: 100 }}>
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
          <View
            style={{
              flex: 2,
              //   backgroundColor: "red",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flex: 0.5,
                justifyContent: "flex-end",
                paddingBottom: 12,
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
            <View
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
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
