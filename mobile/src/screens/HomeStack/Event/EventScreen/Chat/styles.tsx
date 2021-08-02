// styles.js

import { StyleSheet } from "react-native";

export default class StyleSheetFactory {
  static getSheet(isSender: boolean) {
    return StyleSheet.create({
      imageContainer: {
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: isSender ? "#ff2281" : "#7122fa",
        padding: 10,
        borderRadius: 25,
        marginTop: 5,
        maxWidth: "60%",
        alignSelf: isSender ? "flex-end" : "flex-start",
        color: "white",
        // borderRadius: 20,
        // break
        // display: "flex",
        // justifyContent: "center",
        // width: 200,
        // height: 70,
        // alignSelf: isSender ? "flex-end" : "flex-start",
        // backgroundColor: isSender ? "#f98289" : "white",
        // padding: 10,
        // marginBottom: 20,
        // borderRadius: 20,
      },
    });
  }
}
