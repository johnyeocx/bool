import { Dispatch, SetStateAction, useRef } from "react";
import * as React from "react";
import { View, TextInput } from "react-native";
import { StyleSheet } from "react-native";

interface InputProps {
  placeholder: string;
  handleSubmit: () => any | undefined;
  value: string | undefined;
  setValue: Dispatch<SetStateAction<string | undefined>>;
}

const ChatInput = ({ value, setValue, placeholder }: InputProps) => {
  const input = useRef(null);
  return (
    <View style={styles.container}>
      <TextInput
        ref={input}
        autoCapitalize="none"
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor="#ddd"
        value={value}
        multiline={true}
        onChange={(e) => setValue(e.nativeEvent.text)}
      />
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  container: {
    flex: 3,
    display: "flex",
    justifyContent: "center",
    marginLeft: 20,
    backgroundColor: "#222",
    minHeight: 35,
    borderRadius: 5,
    // paddingVertical: 5,
    paddingHorizontal: 10,
  },
  textInput: {
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
    paddingTop: 0,
    paddingBottom: 0,
  },
});
