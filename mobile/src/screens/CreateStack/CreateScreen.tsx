import React, { useState } from "react";
import {
  View,
  Dimensions,
  useWindowDimensions,
  Button,
  TouchableOpacity,
  Text,
} from "react-native";
import NavHeader from "../../components/NavHeader";
import { ThemeContext } from "../../ThemeProvider";
import { chosenMembers, myself, newGroup } from "../../apollo/cache";
import { useReactiveVar } from "@apollo/client";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { SimpleLineIcons } from "@expo/vector-icons";
import CreatePlan from "./Tabs/CreatePlan";
import CreateEvent from "./Tabs/CreateEvent";
import DetailsContainer from "./components/DetailsContainer";
import { ReactNativeFile } from "apollo-upload-client";
import { User } from "../../types/types";

const CustomHeaderRight = ({ navigation, onClick, name }: any) => {
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        paddingRight: 12,
        paddingLeft: 12,
      }}
      onPress={() => {
        onClick();
      }}
    >
      <Text
        style={{
          color: "#f46",
          fontFamily: "Avenir",
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default function GroupScreen({ navigation, route }: any) {
  const firstScreen = () => <CreatePlan />;
  const renderScene = SceneMap({
    first: firstScreen,
    second: CreateEvent,
  });
  const [render, setRender] = useState(false);

  // CLICKS
  const clearScreen = () => {
    newGroup({
      name: "",
      description: "",
      members: [myself()!.id],
      image: new ReactNativeFile({
        uri: "https://icon-library.com/images/no-profile-picture-icon/no-profile-picture-icon-13.jpg",
        name: "default",
        type: "jpeg",
      }),
    });
    chosenMembers([myself!()]);

    // setChosenMembers([myself()!]);
  };

  const createClicked = () => {
    console.log("CREATING NEW GROUP: ", newGroup());
  };
  // LAYOUT
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <NavHeader name="New Event" />,
      headerStyle: {
        height: 80,
        backgroundColor: "#222",
      },
      headerRight: () => (
        <CustomHeaderRight onClick={() => createClicked()} name="Create" />
      ),
      headerLeft: () => (
        <CustomHeaderRight onClick={() => clearScreen()} name="Clear" />
      ),
    });
  }, [navigation]);

  // STATE
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes, setRoutes] = React.useState([
    { key: "first", title: "PLAN" },
    { key: "second", title: "EVENT" },
  ]);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "white" }}
      style={{ backgroundColor: "#121212" }}
      renderIcon={({ route, focused, color }) => (
        <SimpleLineIcons
          name={route.key == "first" ? "notebook" : "event"}
          size={22}
          color={color}
        />
      )}
      renderLabel={({ route, focused, color }) => null}
    />
  );

  const theme = React.useContext(ThemeContext);
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: theme.colors.backgroundPrimary,
      }}
    >
      {/* <TabView
        style={{
          backgroundColor: "red",
          width: Dimensions.get("screen").width,
        }}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        transitionStyle="curl"
      /> */}
      <CreatePlan />
    </View>
  );
}
