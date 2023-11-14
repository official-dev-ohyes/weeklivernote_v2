import * as React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useRef, useMemo, useCallback } from "react";
import { Button } from "react-native-paper";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { fetchHomeRoute } from "../api/mapApi";
import { HomeMarker, NowMarker } from "../assets";
import HomeRouteDetail from "../components/LastChance/HomeRouteDetail";

function HomeRouteScreen({ navigation }) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [region, setRegion] = useState({
    latitude: 35.1110783,
    longitude: 128.8798523,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [pathType, setPathType] = useState(null);
  const [info, setInfo] = useState(null);
  const [subPath, setSubPath] = useState(null);

  // 지도의 영역이 변경될 때 실행되는 함수
  const onRegionChange = (newRegion) => {
    console.log("New Region:", newRegion);
    // 여기에서 새로운 지도의 영역을 처리하거나 상태를 업데이트할 수 있다!
    // setRegion(newRegion);  // 예를 들어, 지도 영역을 업데이트하려면 이런식으로.
  };

  const {
    data: RouteData,
    isLoading,
    isError,
  } = useQuery("RouteDataQuery", async () => await fetchHomeRoute());

  useEffect(() => {
    if (!isLoading && RouteData) {
      console.log("경로야 들어와줘", RouteData.shortRoute);
      setPathType(RouteData.shortRoute.pathType);
      setInfo(RouteData.shortRoute.info);
      setSubPath(RouteData.shortRoute.subPath);
    }
  }, [RouteData, isLoading]);

  useEffect(() => {
    // 컴포넌트가 마운트되면 bottomSheet를 초기에 보이도록 설정
    bottomSheetModalRef.current?.present();
  }, []);

  const snapPoints = useMemo(() => ["20%", "80%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <MapView
          // provider={PROVIDER_GOOGLE}
          style={styles.mapStyle}
          region={region}
          onRegionChange={onRegionChange}
        >
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            title="현재위치"
            // image={{ uri: NowMarker }}
          />
          {/* <Polyline
            coordinates={[
              { latitude: 35.1110783, longitude: 128.8798523 },
              { latitude: 35.1110784, longitude: 128.8798524 },
              { latitude: 35.1110774, longitude: 128.8798514 },
              { latitude: 35.1110874, longitude: 128.8798414 },
              { latitude: 35.7948605, longitude: 128.4596065 },
              { latitude: 35.8025259, longitude: 128.4351431 },
            ]}
            strokeColor="lightblue"
            strokeColors={[
              "#7F0000",
              "#00000000",
              "#B24112",
              "#E5845C",
              "#238C23",
              "#7F0000",
            ]}
            strokeWidth={6}
          /> */}
        </MapView>
        <Button
          mode="elevated"
          onPress={handlePresentModalPress}
          style={styles.button}
        >
          상세 경로 확인하기
        </Button>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <View style={styles.contentContainer}>
            {/* <HomeRouteDetail
              pathType={pathType}
              info={info}
              subPath={subPath}
            /> */}
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 24,
    justifyContent: "center",
    backgroundColor: "lightblue",
  },
  contentContainer: {
    // display: "flex",
    // flexDirection: "column",
    // backgroundColor: "red",
    // width: "90%",
    // marginRight: "auto",
    // marginLeft: "auto",
  },
  mapStyle: {
    width: "100%",
    height: "100%",
  },
  button: {
    position: "absolute",
    top: 16, // 원하는 위치로 조정
    left: 16, // 원하는 위치로 조정
    zIndex: 1,
  },
});

export default HomeRouteScreen;
