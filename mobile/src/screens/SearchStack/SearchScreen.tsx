import * as React from "react";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import RegularInput from "../../components/RegularInput";
import { useMutation, gql } from "@apollo/client";

const GET_USER = gql`
  query User($username: String!) {
    user(username: $username) {
      username
      profileImg
    }
  }
`;
const SearchScreen = () => {
  const [query, setQuery] = useState<string>();

  const handleSubmit = () => {
    console.log(query);
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 20,
          marginBottom: 30,
        }}
      >
        ALL KINDS OF SEARCH
      </Text>
      <RegularInput
        placeholder="Search a user"
        handleSubmit={handleSubmit}
        value={query}
        setValue={setQuery}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 100,
  },
});

export default SearchScreen;
