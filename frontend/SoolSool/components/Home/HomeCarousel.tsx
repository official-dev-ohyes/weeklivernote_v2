import * as React from "react";
import {
  StatusBar,
  Animated,
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from "react-native";
import UserStatus from "./UserStatus";
import { mainbackground, subbackground } from "../../assets";

const { width, height } = Dimensions.get("screen");

// const bgs = ["#A5BBFF", "#DDBEFE"];
const DATA = [
  {
    key: "0",
  },
  {
    key: "1",
  },
];

const Indicator = ({ scrollX }) => {
  return (
    <View
      style={{
        position: "absolute",
        top: 20,
        flexDirection: "row",
      }}
    >
      {DATA.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.8, 1.4, 0.8],
          extrapolate: "clamp",
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.6, 0.9, 0.6],
          extrapolate: "clamp",
        });
        return (
          <Animated.View
            key={`indicator-${i}`}
            style={{
              height: 6,
              width: 6,
              borderRadius: 5,
              backgroundColor: "#0477BF",
              // backgroundColor: "#A5BBFF",
              opacity,
              margin: 10,
              transform: [{ scale }],
            }}
          />
        );
      })}
    </View>
  );
};

// const Backdrop = ({ scrollX }) => {
//   const backgroundColor = scrollX.interpolate({
//     inputRange: bgs.map((_, i) => i * width),
//     outputRange: bgs.map((bg) => bg),
//   });

//   return (
//     <Animated.View
//       style={[
//         StyleSheet.absoluteFillObject,
//         {
//           backgroundColor,
//         },
//       ]}
//     />
//   );
// };

// const Square = ({ scrollX }) => {
//   const YOLO = Animated.modulo(
//     Animated.divide(Animated.modulo(scrollX, width), new Animated.Value(width)),
//     1
//   );

//   const rotate = YOLO.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: ["35deg", "0deg", "35deg"],
//   });
//   const translateX = YOLO.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [0, -height, 0],
//   });

//   return (
//     <Animated.View
//       style={{
//         width: height,
//         height,
//         backgroundColor: "#fff",
//         borderRadius: 86,
//         position: "absolute",
//         top: -height * 0.6,
//         left: -height * 0.3,
//         transform: [
//           {
//             rotate,
//           },
//           {
//             translateX,
//           },
//         ],
//       }}
//     />
//   );
// };

export default function HomeCarousel() {
  const scrollX = React.useRef(new Animated.Value(0)).current;

  return (
    <ImageBackground source={subbackground} style={styles.background}>
      <StatusBar hidden />
      {/* <Backdrop scrollX={scrollX} /> */}
      {/* <Square scrollX={scrollX} /> */}
      <Animated.FlatList
        data={DATA}
        keyExtractor={(item) => item.key}
        horizontal
        scrollEventThrottle={32}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={{ paddingBottom: 180 }}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        renderItem={({ item }) => {
          return (
            <View style={{ width, alignItems: "center" }}>
              <View
                style={{
                  flex: 0.7,
                  justifyContent: "center",
                  padding: 20,
                }}
              >
                <UserStatus identifier={item.key} />
              </View>
            </View>
          );
        }}
      />
      <Indicator scrollX={scrollX} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
