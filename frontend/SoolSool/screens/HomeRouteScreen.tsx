import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useRef, useMemo, useCallback } from "react";

function HomeRouteScreen() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  const test = () => {
    console.log("바깥 버튼도 선택이 잘 된다는 거!");
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Button title="테스트" color="blue" onPress={test} />
        <Button
          onPress={handlePresentModalPress}
          title="Present Modal"
          color="black"
        />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <View style={styles.contentContainer}>
            <Text>Awesome 🎉</Text>
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "lightblue",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "red",
  },
});

export default HomeRouteScreen;
