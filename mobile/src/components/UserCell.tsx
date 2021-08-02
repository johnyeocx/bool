// import React from "react";

// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   Pressable,
//   Alert,
// } from "react-native";

// function UserCell({ item, index }: any) {
//   return (
//     <View>
//       <Pressable
//         style={styles.cellContainer}
//         onPress={
//           isEditable[index]
//             ? () => toggleAdded(index)
//             : () => console.log("not editable")
//         }
//       >
//         <View style={styles.cellLeft}>
//           <Image style={styles.userImage} source={{ uri: item.profileImg }} />
//           <Text style={styles.userName}>{item.username}</Text>
//         </View>
//         <View style={styles.cellRight}>
//           {isEditable[index] ? (
//             <View style={styles.editableContainer}>
//               {isAdded[index] && <View style={styles.addedIndicator} />}
//             </View>
//           ) : (
//             <View>
//               <Text style={styles.addedText}>Added</Text>
//             </View>
//           )}
//         </View>
//       </Pressable>
//       <View style={styles.inset}></View>
//     </View>
//   );
// }

// export default UserCell;
