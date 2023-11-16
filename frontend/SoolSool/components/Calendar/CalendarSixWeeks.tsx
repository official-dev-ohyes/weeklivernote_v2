import React, { useEffect } from "react";
import { useState, useRef, useMemo, useCallback } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { FAB } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery, useQueryClient } from "react-query";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { ImageBackground } from "expo-image";
import { Calendar } from "react-native-calendars";
import "./LocaleConfig"; // 달력 서식

import DailySummary from "./DailySummary";
import { fetchMonthRecord } from "../../api/drinkRecordApi";
import { adaptiveIcon } from "../../assets";
import { getRealToday } from "../../utils/timeUtils";

function CalendarSixWeeks({ navigation }) {
  // 진짜 오늘 정보 저장
  const nowDate = getRealToday();

  const [currentDay, setCurrentDay] = useState("");
  const [isFuture, setIsFuture] = useState<boolean>(false);
  const [selectDay, setSelectDay] = useState("");
  const [isSelectDay, setIsSelectDay] = useState<boolean>(false);
  const [alcoholDays, setAlcoholDays] = useState([]);
  const [renderFlag, setRenderFlag] = useState<boolean>(true);
  const queryClient = useQueryClient();
  const tempDay = currentDay ? currentDay : nowDate;

  const {
    data: MonthlyData,
    isLoading,
    isError,
  } = useQuery(
    ["MonthlyQuery", renderFlag],
    async () => {
      if (renderFlag) {
        const data = await fetchMonthRecord(tempDay);
        setRenderFlag(false);
        return data;
      }
    },
    {
      onSuccess: (data) => {
        if (data) {
          const tempDays = [];
          for (let i = 0; i < data.drinks.length; i++) {
            const tempDate = data.drinks[i].date;
            tempDays.push(tempDate);
          }
          setAlcoholDays(tempDays);
        }
      },
    }
  );

  // Bottom Sheet
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const dynamicSnapPoints = useMemo(() => {
    const isToday = selectDay === nowDate;
    const snapPoints =
      isToday || !alcoholDays.includes(selectDay) ? ["25%"] : ["25%", "100%"];
    return snapPoints;
  }, [selectDay, alcoholDays]);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("Sheet Index:", index);
    if (index === -1) {
      setSelectDay("");
      setIsSelectDay(false);
    }
  }, []);

  // 네비게이션 이동 시 재렌더링
  useFocusEffect(
    React.useCallback(() => {
      setRenderFlag(true);
      queryClient.invalidateQueries("MonthlyQuery");
    }, [])
  );

  // 특정일 클릭
  const handleDayPress = async (date) => {
    const clickDay = date.dateString;

    // 현재 날짜(nowDate)와 클릭한 날짜(clickDay) 비교
    const selectedTimeStamp = date.timestamp;
    const nowTimestamp = new Date(nowDate).getTime();

    if (nowTimestamp < selectedTimeStamp) {
      setIsFuture(true);
    } else {
      setIsFuture(false);
    }

    if (clickDay === selectDay) {
      setSelectDay("");
      setIsSelectDay(false);
      setIsFuture(false);
    } else {
      setSelectDay(clickDay);
      setCurrentDay(clickDay);
      const existingData = MonthlyData?.drinks.find(
        (drink) => drink.date === clickDay
      );

      if (!existingData) {
        await fetchMonthRecord(clickDay);
      }

      setIsSelectDay(true);
      handlePresentModalPress();
    }
  };

  // 이전/다음 달 이동 로직
  const handlePressArrowLeft = async (newMonth) => {
    newMonth();
    shiftMonth("previous");
  };

  const handelPressArrowRight = async (newMonth) => {
    newMonth();
    shiftMonth("next");
  };

  const shiftMonth = (to) => {
    const current = new Date(currentDay);
    let shiftDay;
    if (to === "next") {
      shiftDay = `${current.getFullYear()}-${
        current.getMonth() + 2 < 10 ? "0" : ""
      }${current.getMonth() + 2}-${"01"}`;
    } else {
      shiftDay = `${current.getFullYear()}-${
        current.getMonth() < 10 ? "0" : ""
      }${current.getMonth()}-${"01"}`;
    }
    setRenderFlag(true);
    setCurrentDay(shiftDay);
    fetchMonthRecord(shiftDay);
  };

  const handleCreateRecordPressed = () => {
    navigation.navigate("RecordCreate", {
      date: selectDay,
      isAlcohol: alcoholDays.includes(selectDay),
    });
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.totalContainer}>
        <Calendar
          current={currentDay}
          onPressArrowLeft={handlePressArrowLeft}
          onPressArrowRight={handelPressArrowRight}
          style={styles.calenderStyle}
          // disableAllTouchEventsForDisabledDays
          // onMonthChange={(date) => {
          //   console.log(169, date);
          // }}
          renderHeader={(date) => {
            return (
              <Text style={styles.calendarHeader}>
                {date.toString("yyyy년 MMMM")}
              </Text>
            );
          }}
          dayComponent={({ date, state }) => {
            const alcoholKey = date.dateString;
            const isDisabled = state === "disabled";
            const isActive = alcoholKey === selectDay;
            const isToday = alcoholKey === nowDate;

            return (
              <TouchableOpacity
                onPress={() => {
                  handleDayPress(date);
                }}
                style={[
                  styles.calendarCell,
                  isDisabled && {
                    opacity: 0.65,
                    paddingLeft: 0,
                  },
                ]}
              >
                <View style={styles.calendarCell}>
                  <Text
                    style={[
                      styles.calendarDate,
                      isToday && styles.todayDate,
                      isActive && styles.selectDate,
                    ]}
                  >
                    {date.day}
                  </Text>
                  {alcoholDays.includes(alcoholKey) ? (
                    <ImageBackground
                      source={adaptiveIcon}
                      style={styles.calendarStamp}
                    />
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          }}
        />

        {isSelectDay ? (
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={dynamicSnapPoints}
            onChange={handleSheetChanges}
          >
            <View style={styles.dailySummaryComponent}>
              <View style={styles.tempBox}>
                <Text style={styles.headerText}>{selectDay}</Text>
                {alcoholDays.includes(selectDay) ? (
                  <DailySummary
                    navigation={navigation}
                    summaryText={selectDay}
                    alcoholDays={alcoholDays}
                    onRemove={() => {
                      setRenderFlag(true); // 상태 변경으로 인한 재렌더링을 유도
                    }}
                  />
                ) : nowDate === selectDay ? (
                  <Text style={styles.innerText}>
                    내일 새벽 5시에 업데이트 됩니다.
                  </Text>
                ) : isFuture ? (
                  <Text style={styles.innerText}>아직은 기록할 수 없어요.</Text>
                ) : (
                  <FAB
                    icon="plus"
                    style={styles.fab}
                    color="white"
                    onPress={handleCreateRecordPressed}
                  />
                )}
              </View>
            </View>
          </BottomSheetModal>
        ) : null}
      </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  totalContainer: {
    height: "100%",
    flexDirection: "column",
  },
  calenderStyle: {
    backgroundColor: "black",
    width: "95%",
    marginRight: "auto",
    marginLeft: "auto",
    borderRadius: 5,
    // 그림자 추가 (Android 및 iOS 모두에서 동작)
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // 안드로이드에서 그림자 효과 추가
  },
  calendarHeader: {
    // @@@@@@@@@@@@@@@@@@@@@@@@달력 헤더 맨 위 문구@@@@@@@@@@@@@@@@@@@@@@@@
    fontSize: 18,
    fontFamily: "LineRegular",
    color: "#fff",
    textAlign: "center",
  },
  calendarCell: {
    alignItems: "center",
    height: 90, // @@@@@@@@@@@@@@@@@@@@@@@@다시 생각해보자@@@@@@@@@@@@@@@@@@@@@@@@ 이럴거면 스크롤뷰 달아야 함
    width: "100%",
    backgroundColor: "#000", // @@@@@@@@@@@@@@@@@@@@@@@@달력 내부 칸 색상@@@@@@@@@@@@@@@@@@@@@@@@
    marginVertical: -7,
    paddingTop: 7,
    paddingLeft: 1,
  },
  calendarDate: {
    color: "white", // @@@@@@@@@@@@@@@@@@@@@@@@달력 내부 글씨 색상@@@@@@@@@@@@@@@@@@@@@@@@
  },
  todayDate: {
    color: "#CA77FF",
  },
  selectDate: {
    color: "#FFDE68",
  },
  calendarStamp: {
    height: "83%", // @@@@@@@@@@@@@@@@@@@@@@@@술마신 날 도장@@@@@@@@@@@@@@@@@@@@@@@@
    width: "83%",
  },
  dailySummaryComponent: {
    flex: 1,
    height: "100%",
  },
  tempBox: {
    height: "90%",
  },
  headerText: {
    marginHorizontal: "5%",
    fontSize: 18,
    color: "#363C4B",
    fontFamily: "LineRegular",
    textAlign: "left",
  },
  innerText: {
    height: "80%",
    fontSize: 20,
    fontFamily: "LineRegular",
    textAlign: "center",
    top: "40%",
  },
  fab: {
    alignSelf: "center",
    justifyContent: "center",
    margin: "1%",
    backgroundColor: "#121B33",
    top: "20%",
  },
});

export default CalendarSixWeeks;
