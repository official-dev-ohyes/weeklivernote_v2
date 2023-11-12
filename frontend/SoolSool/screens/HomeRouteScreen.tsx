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
import * as Location from "expo-location";
import { useQuery } from "react-query";
import { fetchHomeRoute } from "../api/mapApi";
import { HomeMarker, NowMarker } from "../assets";
import HomeRouteDetail from "../components/LastChance/HomeRouteDetail";

function HomeRouteScreen() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [region, setRegion] = useState({
    latitude: 35.1110783,
    longitude: 128.8798523,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  // const [pathType, setPathType] = useState(null);
  // const [info, setInfo] = useState(null);
  // const [subPath, setSubPath] = useState(null);

  const [pathType, setPathType] = useState(1);
  const [info, setInfo] = useState({
    trafficDistance: 15917,
    totalWalk: 686,
    totalTime: 54,
    payment: 1550,
    busTransitCount: 1,
    subwayTransitCount: 1,
    mapObj: "71200:1:34:49@70002:2:70227:70235",
    firstStartStation: "하단교차로",
    lastEndStation: "화명",
    totalStationCount: 23,
    busStationCount: 15,
    subwayStationCount: 8,
    totalDistance: 16603,
    totalWalkTime: -1,
    checkIntervalTime: 100,
    checkIntervalTimeOverYn: "N",
  });
  const [subPath, setSubPath] = useState([
    {
      trafficType: 3,
      distance: 188,
      sectionTime: 3,
    },
    {
      trafficType: 2,
      distance: 6917,
      sectionTime: 26,
      stationCount: 15,
      lane: [
        {
          busNo: "338",
          type: 1,
          busID: 71200,
          busLocalBlID: "5200338000",
          busCityCode: 7000,
          busProviderCode: 11,
        },
      ],
      startName: "하단교차로",
      startX: 128.967728,
      startY: 35.107633,
      endName: "서부시외버스터미널(사상역)",
      endX: 128.984088,
      endY: 35.163605,
      startID: 622981,
      startStationCityCode: 7000,
      startStationProviderCode: 11,
      startLocalStationID: "177710501",
      startArsID: "10-081",
      endID: 624484,
      endStationCityCode: 7000,
      endStationProviderCode: 11,
      endLocalStationID: "201620502",
      endArsID: "15-076",
      passStopList: {
        stations: [
          {
            index: 0,
            stationID: 622981,
            stationName: "하단교차로",
            stationCityCode: 7000,
            stationProviderCode: 11,
            localStationID: "177710501",
            arsID: "10-081",
            x: "128.967728",
            y: "35.107633",
            isNonStop: "N",
          },
          {
            index: 1,
            stationID: 623005,
            stationName: "에덴공원",
            stationCityCode: 7000,
            stationProviderCode: 11,
            localStationID: "177700301",
            arsID: "10-087",
            x: "128.965304",
            y: "35.111384",
            isNonStop: "N",
          },
          {
            index: 2,
            stationID: 623009,
            stationName: "동아대입구",
            stationCityCode: 7000,
            stationProviderCode: 11,
            localStationID: "177690301",
            arsID: "10-092",
            x: "128.963586",
            y: "35.113616",
            isNonStop: "N",
          },
          {
            index: 3,
            stationID: 623011,
            stationName: "동산삼거리",
            stationCityCode: 7000,
            stationProviderCode: 11,
            localStationID: "178830301",
            arsID: "10-093",
            x: "128.962621",
            y: "35.114606",
            isNonStop: "N",
          },
          {
            index: 4,
            stationID: 624375,
            stationName: "엄궁한신1차아파트",
            stationCityCode: 7000,
            stationProviderCode: 11,
            localStationID: "194730101",
            arsID: "15-199",
            x: "128.967818",
            y: "35.12548",
            isNonStop: "N",
          },
          {
            index: 5,
            stationID: 624377,
            stationName: "엄궁동주민센터",
            stationCityCode: 7000,
            stationProviderCode: 11,
            localStationID: "201940101",
            arsID: "15-200",
            x: "128.970338",
            y: "35.128804",
            isNonStop: "N",
          },
          {
            index: 6,
            stationID: 625102,
            stationName: "엄궁삼거리",
            stationCityCode: 7000,
            stationProviderCode: 11,
            localStationID: "201930101",
            arsID: "15-187",
            x: "128.972089",
            y: "35.132144",
            isNonStop: "N",
          },
          {
            index: 7,
            stationID: 625103,
            stationName: "경동스틸",
            stationCityCode: 7000,
            stationProviderCode: 11,
            localStationID: "195100101",
            arsID: "15-177",
            x: "128.974817",
            y: "35.136403",
            isNonStop: "N",
          },
          {
            index: 8,
            stationID: 625105,
            stationName: "케스텍코리아",
            stationCityCode: 7000,
            stationProviderCode: 11,
            localStationID: "195100102",
            arsID: "15-172",
            x: "128.977641",
            y: "35.13949",
            isNonStop: "N",
          },
          {
            index: 9,
            stationID: 625107,
            stationName: "유유철강",
            stationCityCode: 7000,
            stationProviderCode: 11,
            localStationID: "202040101",
            arsID: "15-169",
            x: "128.979959",
            y: "35.142473",
            isNonStop: "N",
          },
          {
            index: 10,
            stationID: 625109,
            stationName: "경북철강",
            stationCityCode: 7000,
            stationProviderCode: 11,
            localStationID: "194510101",
            arsID: "15-146",
            x: "128.981134",
            y: "35.147052",
            isNonStop: "N",
          },
          {
            index: 11,
            stationID: 625088,
            stationName: "대풍주유소",
            stationCityCode: 7000,
            stationProviderCode: 11,
            localStationID: "201730101",
            arsID: "15-136",
            x: "128.982483",
            y: "35.152449",
            isNonStop: "N",
          },
          {
            index: 12,
            stationID: 625090,
            stationName: "새벽시장",
            stationCityCode: 7000,
            stationProviderCode: 11,
            localStationID: "201730102",
            arsID: "15-137",
            x: "128.982932",
            y: "35.154185",
            isNonStop: "N",
          },
          {
            index: 13,
            stationID: 624643,
            stationName: "감전시장",
            stationCityCode: 7000,
            stationProviderCode: 11,
            localStationID: "195260101",
            arsID: "15-091",
            x: "128.983531",
            y: "35.156551",
            isNonStop: "N",
          },
          {
            index: 14,
            stationID: 625092,
            stationName: "KEB하나은행",
            stationCityCode: 7000,
            stationProviderCode: 11,
            localStationID: "194950101",
            arsID: "15-087",
            x: "128.984093",
            y: "35.159458",
            isNonStop: "N",
          },
          {
            index: 15,
            stationID: 624484,
            stationName: "서부시외버스터미널(사상역)",
            stationCityCode: 7000,
            stationProviderCode: 11,
            localStationID: "201620502",
            arsID: "15-076",
            x: "128.984088",
            y: "35.163605",
            isNonStop: "N",
          },
        ],
      },
    },
    {
      trafficType: 3,
      distance: 129,
      sectionTime: 2,
    },
    {
      trafficType: 1,
      distance: 9000,
      sectionTime: 17,
      stationCount: 8,
      lane: [
        {
          name: "부산 2호선",
          subwayCode: 72,
          subwayCityCode: 7000,
        },
      ],
      startName: "사상",
      startX: 128.98458,
      startY: 35.16251,
      endName: "화명",
      endX: 129.013885,
      endY: 35.235596,
      way: "화명",
      wayCode: 2,
      door: "null",
      startID: 70227,
      endID: 70235,
      startExitNo: "6",
      startExitX: 128.98399360763128,
      startExitY: 35.16388158495706,
      endExitNo: "2",
      endExitX: 129.01397456383262,
      endExitY: 35.23519793117611,
      passStopList: {
        stations: [
          {
            index: 0,
            stationID: 70227,
            stationName: "사상",
            x: "128.984583",
            y: "35.162518",
          },
          {
            index: 1,
            stationID: 70228,
            stationName: "덕포",
            x: "128.983774",
            y: "35.173296",
          },
          {
            index: 2,
            stationID: 70229,
            stationName: "모덕",
            x: "128.985602",
            y: "35.180374",
          },
          {
            index: 3,
            stationID: 70230,
            stationName: "모라",
            x: "128.988656",
            y: "35.189667",
          },
          {
            index: 4,
            stationID: 70231,
            stationName: "구남",
            x: "128.994953",
            y: "35.196827",
          },
          {
            index: 5,
            stationID: 70232,
            stationName: "구명",
            x: "128.999527",
            y: "35.202787",
          },
          {
            index: 6,
            stationID: 70233,
            stationName: "덕천",
            x: "129.005068",
            y: "35.210873",
          },
          {
            index: 7,
            stationID: 70234,
            stationName: "수정",
            x: "129.009167",
            y: "35.223314",
          },
          {
            index: 8,
            stationID: 70235,
            stationName: "화명",
            x: "129.01389",
            y: "35.235603",
          },
        ],
      },
    },
    {
      trafficType: 3,
      distance: 369,
      sectionTime: 6,
    },
  ]);

  // 지도의 영역이 변경될 때 실행되는 함수
  const onRegionChange = (newRegion) => {
    console.log("New Region:", newRegion);
    // 여기에서 새로운 지도의 영역을 처리하거나 상태를 업데이트할 수 있다!
    // setRegion(newRegion);  // 예를 들어, 지도 영역을 업데이트하려면 이런식으로.
  };

  // const {
  //   data: RouteData,
  //   isLoading,
  //   isError,
  // } = useQuery(
  //   "RouteDataQuery",
  //   async () =>
  //     await fetchHomeRoute({
  //       nowLat: 35.106264217962284,
  //       nowLong: 128.9665174484257,
  //       homeLat: 35.23500167069489,
  //       homeLong: 129.01787638664285,
  //     })
  // );

  // useEffect(() => {
  //   if (!isLoading && RouteData) {
  //     console.log("경로야 들어와줘", RouteData.shortRoute);
  //     setPathType(RouteData.shortRoute.pathType);
  //     setInfo(RouteData.shortRoute.info);
  //     setSubPath(RouteData.shortRoute.subPath);
  //   }
  // }, [RouteData, isLoading]);

  const snapPoints = useMemo(() => ["15%", "80%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Button
          mode="contained-tonal"
          onPress={handlePresentModalPress}
          style={styles.button}
        >
          모달을 보여주세요
        </Button>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
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
          <Polyline
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
          />
        </MapView>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <View style={styles.contentContainer}>
            {/* <Text>Awesome 🎉</Text> */}
            <HomeRouteDetail
              pathType={pathType}
              info={info}
              subPath={subPath}
            />
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
  map: {
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
