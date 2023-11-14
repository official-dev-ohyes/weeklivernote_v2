import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import React from "react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Calendar } from "react-native-calendars";
import DailySummary from "./DailySummary";
import { fetchMonthRecord } from "../../api/drinkRecordApi";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery, useQueryClient } from "react-query";
import { ImageBackground } from "expo-image";
import "./LocaleConfig"; // 달력 서식
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
  const { height } = Dimensions.get("window");
  const [isSelectDay, setIsSelectDay] = useState<boolean>(false);
  const [selectDay, setSelectDay] = useState("");
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
    // ["MonthlyQuery", currentDay, selectDay, navigator],
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
      setIsSelectDay(false);
    }
  }, []);

  useEffect(() => {
    // console.log(`현재 날짜는? ${nowDate}`);
    if (tempDay) {
      setCurrentDay(tempDay);
    }

    if (selectDay) {
      const checkFuture = () => {
        const selectedTimeStamp = new Date(selectDay).getTime();
        const nowTimestamp = new Date(nowDate).getTime();
        if (nowTimestamp < selectedTimeStamp) {
          setIsFuture(true);
        } else {
          setIsFuture(false);
        }
      };
      checkFuture();
    }
  }, [MonthlyData]);

  // 네비게이션 이동 시, 재렌더링
  useFocusEffect(
    React.useCallback(() => {
      setRenderFlag(true);
      queryClient.invalidateQueries("MonthlyQuery");
    }, [])
  );
  // useFocusEffect(
  //   React.useCallback(() => {
  //     // console.log(`현재 날짜는? ${nowDate}`);
  //     if (tempDay) {
  //       setCurrentDay(tempDay);
  //     }

  //     if (selectDay) {
  //       const checkFuture = () => {
  //         const selectedTimeStamp = new Date(selectDay).getTime();
  //         const nowTimestamp = new Date(nowDate).getTime();
  //         if (nowTimestamp < selectedTimeStamp) {
  //           setIsFuture(true);
  //         } else {
  //           setIsFuture(false);
  //         }
  //       };
  //       checkFuture();
  //     }
  //     queryClient.invalidateQueries("MonthlyQuery");
  //   }, [MonthlyData])
  // );

  // 특정일 클릭
  const handleDayPress = async (clickDay) => {
    const newMonth =
      clickDay.month < 10 ? `0${clickDay.month}` : clickDay.month;
    const newDay = clickDay.day < 10 ? `0${clickDay.day}` : clickDay.day;
    const newDate = `${clickDay.year}-${newMonth}-${newDay}`;
    if (newDate === selectDay) {
      setSelectDay("");
      setIsSelectDay(false);
      setIsFuture(false);
    } else {
      setSelectDay(newDate);
      setCurrentDay(newDate);
      const existingData = MonthlyData?.drinks.find(
        (drink) => drink.date === newDate
      );

      if (!existingData) {
        await fetchMonthRecord(newDate);
      }

      if (nowDate === newDate) {
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

  // 캘린더 칸별 높이 -> 주 수 조절 시 상세 조정 필요
  const height1 = (height * 0.9) / 13.5;
  const height2 = (height * 0.9) / 10;

  return (
    <BottomSheetModalProvider>
      <View style={styles.totalContainer}>
        <View style={styles.smallCalendar}>
          <Calendar
            current={currentDay}
            markedDates={{
              ...alcoholDays,
              [selectDay]: {
                selected: true,
                selectedColor: "yellow",
                selectedTextColor: "black",
                marked: alcoholDays[selectDay] ? true : false,
              },
            }}
            // theme={{
            //   calendarBackground: "rgba(255, 255, 255, 0)",
            //   "stylesheet.day.basic": {
            //     base: {
            //       // height: height1,
            //       height: 10,
            //     },
            //   },
            // }}
            dayTextColor={{
              default: "black",
              disabled: "gray",
            }}
            dayBackgroundColor={{
              default: "transparent",
              disabled: "transparent",
            }}
            onDayPress={handleDayPress}
            onPressArrowLeft={handlePressArrowLeft}
            onPressArrowRight={handelPressArrowRight}
            style={styles.calenderStyle}
            dayComponent={({ date, state }) => {
              const dayFormatted = date.day < 10 ? `0${date.day}` : date.day;
              const alcoholKey = `${date.year}-${date.month}-${dayFormatted}`;
              const isDisabled = state === "disabled";

              return (
                <TouchableOpacity
                  onPress={() => handleDayPress(date)}
                  style={[styles.calendarCell, isDisabled && { opacity: 0.3 }]}
                >
                  <View style={styles.calendarCell}>
                    <Text style={styles.calendarDate}>{date.day}</Text>
                    {alcoholDays[alcoholKey] ? (
                      <ImageBackground
                        source={require("../../assets/adaptive-icon.png")}
                        style={styles.calendarStemp}
                      />
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        {isSelectDay ? (
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={dynamicSnapPoints}
            onChange={handleSheetChanges}
          >
            <View style={styles.dailySummaryComponent}>
              {isSame ? (
                <View style={styles.tempBox}>
                  <View style={styles.headerBox}>
                    <Text style={styles.headerText}>{selectDay}</Text>
                  </View>
                  <View style={styles.dailySummaryTotal}>
                    <Text style={styles.innerText}>
                      내일 새벽 5시에 업데이트 됩니다.
                    </Text>
                  </View>
                </View>
              ) : isFuture ? (
                <View style={styles.tempBox}>
                  <View style={styles.headerBox}>
                    <Text style={styles.headerText}>{selectDay}</Text>
                  </View>
                  <View style={styles.dailySummaryTotal}>
                    <Text style={styles.innerText}>
                      아직은 기록할 수 없어요
                    </Text>
                  </View>
                </View>
              ) : alcoholDays[selectDay] ? (
                <DailySummary
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
                  <View style={styles.dailySummaryTotal}>
                    <FAB
                      icon="plus"
                      style={styles.fab}
                      onPress={() => {
                        navigation.navigate("RecordCreate", {
                          date: selectDay,
                          isAlcohol: alcoholDays[selectDay],
                        });
                      }}
                    />
                  </View>
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
  smallCalendar: {
    height: "auto",
  },
  largeCalendar: {
    height: "100%",
  },
  dailySummaryComponent: {
    flex: 1,
  },
  dailySummaryTotal: {
    height: "75%",
    borderRadius: 5,
    backgroundColor: "#ffffff",
    width: "95%",
    marginRight: "auto",
    marginLeft: "auto",
    flexDirection: "column",
    justifyContent: "center",
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
  tempBox: {
    height: "90%",
  },
  headerBox: {
    height: "30%",
    flexDirection: "row",
    marginLeft: "3%",
  },
  innerText: {
    fontSize: 20,
    fontFamily: "LineRegular",
    textAlign: "center",
  },
  headerText: {
    fontSize: 18,
    fontFamily: "LineRegular",
  },
  calenderStyle: {
    backgroundColor: "rgba(100, 100, 100, 0.2)",
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
  New: {
    width: 70,
    height: 70,
    backgroundColor: "#363C4B",
    borderRadius: 50,
    marginRight: "auto",
    marginLeft: "auto",
  },
  plus: {
    fontSize: 50,
    color: "#FFFFFF",
    textAlign: "center",
    textAlignVertical: "center", // Android
    // flex: 1, // iOS
  },
  eachDayBox: {
    height: "100%",
    backgroundColor: "blue",
  },
  imageContainer: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  calendarCell: {
    flexDirection: "column",
    alignItems: "center",
    height: 90, // @@@@@@@@@@@@@@@@@@@@@@@@다시 생각해보자@@@@@@@@@@@@@@@@@@@@@@@@
    width: "100%",
  },
  calendarDate: {
    height: "50%",
    flex: 1,
  },
  calendarStemp: {
    height: "83%",
    width: "83%",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default CalendarSixWeeks;
