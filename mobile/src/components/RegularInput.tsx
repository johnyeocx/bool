import { Dispatch, SetStateAction, useRef } from "react";
import * as React from "react";
import { View, TextInput } from "react-native";
import { StyleSheet } from "react-native";
import { Button, IconButton, Colors } from "react-native-paper";

interface InputProps {
  placeholder: string;
  handleSubmit?: () => any;
  value: string | undefined;
  setValue: Dispatch<SetStateAction<string | undefined>>;
  secureTextEntry?: boolean;
}

const RegularInput = ({
  secureTextEntry,
  value,
  setValue,
  placeholder,
  handleSubmit,
}: InputProps) => {
  const input = useRef(null);
  return (
    <View style={styles.container}>
      <TextInput
        ref={input}
        autoCapitalize="none"
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor="#ddd"
        onSubmitEditing={handleSubmit}
        value={value}
        onChange={(e) => setValue(e.nativeEvent.text)}
        secureTextEntry={secureTextEntry ? secureTextEntry : false}
      />

      <IconButton
        icon="code-less-than"
        color="#fff"
        style={{
          width: 40,
          height: 40,
          alignItems: "center",
          position: "absolute",
          top: 0,
          right: 0,
          margin: 0,
        }}
        onPress={() => setValue("")}
      ></IconButton>
    </View>
  );
};

export default RegularInput;

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
});
