import React from "react";
import { View, Text, Dimensions, Pressable } from "react-native";
import NavHeader from "../../components/NavHeader";
import { ThemeContext } from "../../ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import SectionHeader from "../../components/SectionHeader";
import { myself, newGroup } from "../../apollo/cache";
import { useReactiveVar } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";

export default function GroupScreen({ navigation, route }: any) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <NavHeader name="New Event" />,
      headerStyle: {
        height: 80,
        backgroundColor: "#222",
      },
    });
  }, [navigation]);

  const theme = React.useContext(ThemeContext);
  const group = useReactiveVar(newGroup);
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: theme.colors.backgroundPrimary,
      }}
    >
      <SectionHeader name="Choose Group" />
      <View
        style={{
          height: 50,
          width: Dimensions.get("screen").width,
          justifyContent: "center",
          paddingLeft: 10,
        }}
      >
        <Pressable
          onPress={() => {
            newGroup({
              name: "",
              description: "",
              image: new ReactNativeFile({
                uri: "https://icon-library.com/images/no-profile-picture-icon/no-profile-picture-icon-13.jpg",
                name: "default",
                type: "jpeg",
              }),
              members: [myself()!.id],
            });
            console.log(newGroup());
            navigation.navigate("New Group");
          }}
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
            Create New Group
          </Text>
        </Pressable>
      </View>
      <View
        style={{
          width: Dimensions.get("screen").width,
          height: 2,
          backgroundColor: "gray",
        }}
      ></View>
    </View>
  );
}
