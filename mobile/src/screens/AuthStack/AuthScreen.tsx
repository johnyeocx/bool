import * as React from "react";
import { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Image,
  Platform,
} from "react-native";
import { ReactNativeFile } from "apollo-upload-client";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RegularInput from "../../components/RegularInput";
import { A_TOKEN } from "../../constants/constants";
import * as ImagePicker from "expo-image-picker";
import { myself } from "../../apollo/cache";

const LOGIN = gql`
  mutation Login($input: Login!) {
    login(input: $input)
  }
`;

const AUTHENTICATE = gql`
  mutation Authenticate {
    authenticate
  }
`;

const SIGN_UP = gql`
  mutation CreateUser($input: NewUser!) {
    createUser(input: $input)
  }
`;

const GET_SELF = gql`
  mutation GetUser($input: String!) {
    getUser(input: $input) {
      id
      username
      email
      profileImg
      settingsId
      events
      friendships
    }
  }
`;

const AuthScreen = ({ navigation }: { navigation: any }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const [username, setUsername] = useState<string | undefined>();
  const [password, setPassword] = useState<string>();
  const [email, setEmail] = useState<string>();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [file, setFile] = useState<ReactNativeFile | null>(null);

  // GRAPHQL REQUESTS
  const [login] = useMutation(LOGIN, {
    onError(err) {
      console.log(err);
    },
  });
  const [authenticate] = useMutation(AUTHENTICATE, {
    onError(err) {
      console.log(err);
      alert(err);
    },
  });
  const [signUp] = useMutation(SIGN_UP, {
    onError(err) {
      console.log(err);
      alert(err);
    },
  });
  const [getSelf] = useMutation(GET_SELF, {
    onError(err) {
      console.log(err);
      alert(err);
    },
  });

  useEffect(() => {
    authenticate().then(({ data }) => {
      if (data) {
        setIsAuthenticated(true);
        // console.log(data);
      }
    });
  }, []);

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

  const handleLogin = async () => {
    const input = {
      username,
      password,
    };
    const { data } = await login({ variables: { input } });
    await SecureStore.setItemAsync(A_TOKEN, data.login);
    setIsAuthenticated(true);
    const result = await getSelf({ variables: { input: username } });
    await AsyncStorage.setItem("user", JSON.stringify(result.data.getUser));
    // myself(result.data.getUser);
    Keyboard.dismiss();
    navigation.navigate("Home");
  };

  const handleDummy = async () => {
    const { data } = await authenticate();
    if (data) {
      setIsAuthenticated(true);
    }
  };

  const handleImgWrapperClicked = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      aspect: [3, 3],
      quality: 1,
      crop: true,
    });

    if (!result.cancelled) {
      const file = new ReactNativeFile({
        uri: result.uri,
        name: username,
        type: result.type,
      });
      setFile(file);
    }
  };

  const handleSignUpButton = async () => {
    const input = {
      username,
      email,
      password,
      profileImg: file,
    };
    const { data } = await signUp({ variables: { input: input } });
    if (data && data.createUser) {
      SecureStore.setItemAsync(A_TOKEN, data.createUser);
      setIsAuthenticated(true);
      navigation.navigate("Home");
    }
  };

  const handleLogOut = () => {
    SecureStore.deleteItemAsync(A_TOKEN);
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 100,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            marginBottom: 30,
          }}
        >
          LOGGED IN
        </Text>
        <TouchableOpacity onPress={handleLogOut} style={styles.logoutButton}>
          <Text>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDummy} style={styles.loginButton}>
          <Text>Authenticate</Text>
        </TouchableOpacity>
        <Text style={{ marginTop: 10, color: "#17f" }}>
          {isAuthenticated ? "Access Token Valid, User Logged In" : null}
        </Text>
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 100,
      }}
    >
      <TouchableOpacity onPress={toggleSwitch} style={styles.switch}>
        <Text>{isEnabled ? "Log In" : "Sign Up"}</Text>
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 20,
          marginBottom: 30,
        }}
      >
        {isEnabled ? "SIGN, UP, PLEASE" : "LOGIN, NOW"}
      </Text>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={handleImgWrapperClicked}
      >
        <Image
          style={styles.profileImg}
          source={
            file
              ? { uri: file.uri }
              : {
                  uri: "https://icon-library.com/images/no-profile-picture-icon/no-profile-picture-icon-13.jpg",
                }
          }
        />
      </TouchableOpacity>

      <RegularInput
        placeholder="Username"
        value={username}
        setValue={setUsername}
      />
      {isEnabled && (
        <RegularInput placeholder="Email" value={email} setValue={setEmail} />
      )}

      <RegularInput
        secureTextEntry={true}
        placeholder="Password"
        value={password}
        setValue={setPassword}
      />

      <TouchableOpacity
        onPress={isEnabled ? handleSignUpButton : handleLogin}
        style={styles.loginButton}
      >
        <Text>{isEnabled ? "Sign Up" : "Login"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    margin: 10,
    backgroundColor: "#222",
    width: 250,
    height: 40,
    borderRadius: 5,
    paddingLeft: 10,
  },
  textInput: {
    color: "white",
  },
  switch: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 30,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#222",
    position: "absolute",
    right: 20,
    top: 50,
  },
  loginButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: 250,
    height: 40,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#222",
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: 250,
    height: 40,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#222",
  },
  profileImg: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  imageContainer: {
    display: "flex",
    width: 90,
    height: 90,
    marginBottom: 20,
  },
});

export default AuthScreen;
