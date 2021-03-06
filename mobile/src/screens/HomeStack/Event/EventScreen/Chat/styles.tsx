// styles.js

import { StyleSheet } from "react-native";
import { myColor } from "../../../../../apollo/cache";

export default class StyleSheetFactory {
  static getSheet(isSender: boolean) {
    return StyleSheet.create({
      imageContainer: {
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: isSender ? `${myColor()}` : "#7122fa",
        padding: 10,
        borderRadius: 25,
        marginTop: 5,
        maxWidth: "60%",
        alignSelf: isSender ? "flex-end" : "flex-start",
        color: "white",
      },
    });
  }
}
