import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import React from "react";
import { useState, useRef, useMemo, useCallback } from "react";
import { Calendar } from "react-native-calendars";
import DailySummary from "./DailySummary";
import { fetchMonthRecord } from "../../api/drinkRecordApi";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery, useQueryClient } from "react-query";
import { ImageBackground } from "expo-image";
import "./LocaleConfig"; // 달력 서식
import { adaptiveIcon } from "../../assets";
import { FAB } from "react-native-paper";

function CalendarSixWeeks({ navigation }) {
  // 진짜 오늘 정보 저장
  const today = new Date();
  const nowDate = `${today.getFullYear()}-${
    today.getMonth() + 1 < 10 ? "0" : ""
  }${today.getMonth() + 1}-${
    today.getDate() < 10 ? "0" : ""
  }${today.getDate()}`;

  const [currentDay, setCurrentDay] = useState("");
  const [isFuture, setIsFuture] = useState<boolean>(false);
  const [selectDay, setSelectDay] = useState("");
  const [isSelectDay, setIsSelectDay] = useState<boolean>(false);
  const [alcoholDays, setAlcoholDays] = useState({});
  const [isSame, setIsSame] = useState<boolean>(false);
  const [renderFlag, setRenderFlag] = useState<boolean>(true);
  const queryClient = useQueryClient();
  const tempDay = currentDay ? currentDay : nowDate;

  const {
    data: MonthlyData,
    isLoading: monthlyLoading,
    isError: monthlyError,
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
          const tempDays = {};
          for (let i = 0; i < data.drinks.length; i++) {
            const tempDate = data.drinks[i].date;
            tempDays[tempDate] = {
              marked: true,
            };
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
      isToday || !alcoholDays[selectDay] ? ["25%"] : ["25%", "100%"];
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

      if (nowDate === clickDay) {
        setIsSame(true);
      } else {
        setIsSame(false);
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
      isAlcohol: alcoholDays[selectDay],
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
          renderHeader={(date) => {
            const header = date.toString("MMMM yyyy");
            const [month, year] = header.split(" ");

            return (
              <Text style={styles.calendarHeader}>
                {year}년 {month}
              </Text>
            );
          }}
          dayComponent={({ date, state }) => {
            const alcoholKey = date.dateString;
            const isDisabled = state === "disabled";

            return (
              <TouchableOpacity
                onPress={() => {
                  handleDayPress(date);
                }}
                style={[styles.calendarCell, isDisabled && { opacity: 0.65 }]}
              >
                <View style={styles.calendarCell}>
                  <Text style={styles.calendarDate}>{date.day}</Text>
                  {alcoholDays[alcoholKey] ? (
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
              {alcoholDays[selectDay] ? (
                <DailySummary
                  navigation={navigation}
                  summaryText={selectDay}
                  alcoholDays={alcoholDays}
                  onRemove={() => {
                    setRenderFlag(true); // 상태 변경으로 인한 재렌더링을 유도
                  }}
                />
              ) : (
                <View style={styles.tempBox}>
                  <View style={styles.headerBox}>
                    <Text style={styles.headerText}>{selectDay}</Text>
                  </View>
                  {isSame ? (
                    <View style={styles.dailySummaryTotal}>
                      <Text style={styles.innerText}>
                        내일 새벽 5시에 업데이트 됩니다
                      </Text>
                    </View>
                  ) : isFuture ? (
                    <View style={styles.dailySummaryTotal}>
                      <Text style={styles.innerText}>
                        아직은 기록할 수 없어요
                      </Text>
                    </View>
                  ) : (
                    <FAB
                      icon="plus"
                      style={styles.fab}
                      color="white"
                      onPress={handleCreateRecordPressed}
                    />
                  )}
                </View>
              )}
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
  dailySummaryComponent: {
    flex: 1,
  },
  dailySummaryTotal: {
    height: "75%",
    justifyContent: "center",
  },
  tempBox: {
    height: "90%",
  },
  headerBox: {
    // summary
    height: "30%",
    flexDirection: "row",
    marginLeft: "5%",
    alignItems: "center",
  },
  innerText: {
    fontSize: 20,
    fontFamily: "LineRegular",
    textAlign: "center",
  },
  headerText: {
    fontSize: 18,
    color: "#363C4B",
    fontFamily: "LineRegular",
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
    paddingTop: 10,
    paddingBottom: 10,
    color: "#fff",
    paddingRight: 5,
  },
  calendarCell: {
    flexDirection: "column",
    alignItems: "center",
    height: 90, // @@@@@@@@@@@@@@@@@@@@@@@@다시 생각해보자@@@@@@@@@@@@@@@@@@@@@@@@ 이럴거면 스크롤뷰 달아야 함
    width: "100%",
    backgroundColor: "#000", // @@@@@@@@@@@@@@@@@@@@@@@@달력 내부 칸 색상@@@@@@@@@@@@@@@@@@@@@@@@
    marginVertical: -7,
    paddingTop: 2,
  },
  calendarDate: {
    color: "white", // @@@@@@@@@@@@@@@@@@@@@@@@달력 내부 글씨 색상@@@@@@@@@@@@@@@@@@@@@@@@
  },
  calendarStamp: {
    height: "83%", // @@@@@@@@@@@@@@@@@@@@@@@@술마신 날 도장@@@@@@@@@@@@@@@@@@@@@@@@
    width: "83%",
  },
  fab: {
    alignSelf: "center",
    justifyContent: "center",
    margin: "1%",
    backgroundColor: "#121B33",
  },
});

export default CalendarSixWeeks;
