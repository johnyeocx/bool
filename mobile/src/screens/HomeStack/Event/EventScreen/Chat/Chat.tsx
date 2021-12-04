import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Event } from "../../../../../types/types";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import { IconButton } from "react-native-paper";
import { gql, useMutation } from "@apollo/client";
import { Message, ChatBucket } from "../../../../../types/types";
import ThemeProvider, { ThemeContext } from "../../../../../ThemeProvider";
import { Theme } from "../../../../../types/themeTypes";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/reducers/reducer";
import { myself } from "../../../../../apollo/cache";

const GET_MESSAGES = gql`
  mutation ChatBuckets($eventId: MongoID!) {
    chatBuckets(eventId: $eventId) {
      bucket
      count
      messages {
        id
        body
        sender
      }
    }
  }
`;

interface ChatProps {
  username: string;
  event: Event;
}

function Chat() {
  const event = useSelector((state: RootState) => state.currentEvent);
  const [username, setUsername] = useState(myself()!.username);
  const [message, setMessage] = useState<any>("");
  const [messages, setMessages] = useState<Array<any>>([]);
  const [chatBuckets, setChatBuckets] = useState();
  const ws = useRef<WebSocket | null>(null);
  const isVisible = useIsFocused();
  const [getMessages] = useMutation(GET_MESSAGES, {
    onError(err) {
      console.log(err);
      alert(err);
    },
  });
  const theme = React.useContext(ThemeContext);

  const initializeMessages = async () => {
    let bucket: any;
    const { data } = await getMessages({
      variables: { eventId: event.id },
    });
    if (data && data.chatBuckets.length > 0) {
      const bucketNumber = data.chatBuckets.length;
      if (data.chatBuckets.length > 1) {
        console.log("loading previous buckets");
        for (let i = 0; i < data.chatBuckets.length - 1; i++) {
          bucket = data.chatBuckets[i];
          for (let j = 0; j < 50; j++) {
            setMessages((messages) => [bucket.messages[j], ...messages]);
          }
        }
      }
      bucket = data.chatBuckets[bucketNumber - 1];
      for (let i = 0; i < bucket.count; i++) {
        setMessages((messages) => [bucket.messages[i], ...messages]);
      }
    }
  };

  useEffect(() => {
    initializeMessages();
  }, []);

  useEffect(() => {
    if (isVisible) {
      console.log("Hello, my username is:");
      console.log(username);
      ws.current = new WebSocket(
        `ws://localhost:8080/ws/${event.id}/${username}`
      );
      ws.current.onopen = (evt) => {
        console.log("Websocked opened!\n", { evt });
      };

      ws.current.onclose = (evt) => {
        console.log("Websocked closed!", { evt });
        ws.current = null;
      };

      ws.current.onmessage = (msg) => {
        const obj = JSON.parse(msg.data);
        setMessages((messages) => [obj, ...messages]);
      };

      ws.current.onerror = (error) => {
        console.log("Websocket error:", { error });
      };
    }

    return function cleanup() {
      if (ws && ws.current) {
        console.log("closing websocket");
        ws.current.close();
      }
      ws.current = null;
    };
  }, [isVisible]);

  const sendMessage = () => {
    if (ws && ws.current) {
      ws.current.send(message!);
      setMessage("");
    }
  };

  return (
    <View style={styles(theme).container}>
      <View style={styles(theme).messageContainer}>
        <Messages messages={messages} username={username} />
      </View>
      <View>
        <View
          style={{
            height: 50,
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#222",
            width: Dimensions.get("window").width,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ChatInput
            value={message}
            setValue={setMessage}
            placeholder="Message"
            handleSubmit={() => {
              sendMessage();
            }}
          />
          <IconButton
            icon="arrow-up-circle"
            color="#fff"
            size={30}
            style={{}}
            onPress={() => sendMessage()}
          ></IconButton>
        </View>

        <View
          style={{
            height: 34,
            backgroundColor: "#222",
            width: Dimensions.get("window").width,
          }}
        ></View>
      </View>
    </View>
  );
}
export default Chat;

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#111",
    },
    messageContainer: {
      flex: 5,
      width: Dimensions.get("window").width,
      justifyContent: "flex-end",
      alignItems: "flex-end",
    },
    eventName: {
      fontSize: 20,
      marginBottom: 450,
    },
    switch: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 80,
      height: 30,
      borderWidth: 2,
      borderRadius: 5,
      borderColor: "#111",
      position: "absolute",
      right: 20,
      top: 50,
    },
  });
