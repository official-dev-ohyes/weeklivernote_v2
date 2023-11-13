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
import { useState, useRef, useMemo, useCallback } from "react";
import { Calendar } from "react-native-calendars";
import DailySummary from "./DailySummary";
import { fetchMonthRecord } from "../../api/drinkRecordApi";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "react-query";
import { getDrinkImageById, getIdByOnlyCategory } from "../../utils/drinkUtils";
import { ImageBackground } from "expo-image";

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

  const tempDay = currentDay ? currentDay : nowDate;

  const {
    data: MonthlyData,
    isLoading: monthlyLoading,
    isError: monthlyError,
  } = useQuery(
    // ["MonthlyQuery", currentDay, selectDay, navigator],
    ["MonthlyQuery", currentDay],
    async () => await fetchMonthRecord(tempDay)
  );

  // Bottom Sheet
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const dynamicSnapPoints = useMemo(() => {
    return alcoholDays[selectDay] ? ["25%", "100%"] : ["25%"];
  }, [selectDay]);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsSelectDay(false);
    }
  }, []);

  // 네비게이션 이동 시, 재렌더링
  useFocusEffect(
    React.useCallback(() => {
      console.log(`현재 날짜는? ${nowDate}`);
      if (tempDay) {
        setCurrentDay(tempDay);
      }
      if (MonthlyData) {
        const tempDays = {};

        console.log(
          "먼슬리데이터의 드링크:",
          JSON.stringify(MonthlyData.drinks, null, 2)
        );
        for (let i = 0; i < MonthlyData.drinks.length; i++) {
          const tempDate = MonthlyData.drinks[i].date;

          tempDays[tempDate] = {
            marked: true,
            image: getDrinkImageById(
              getIdByOnlyCategory(MonthlyData.drinks[i].mainDrink)
            ),
          };
        }
        setAlcoholDays(tempDays);
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
      // }, [nowDate, selectDay, navigator, MonthlyData])
    }, [MonthlyData])
  );

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
      await fetchMonthRecord(newDate);
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
    setCurrentDay(shiftDay);
    fetchMonthRecord(shiftDay);
  };

  // 캘린더 칸별 높이 -> 주 수 조절 시 상세 조정 필요
  const height1 = (height * 0.9) / 13.5;
  const height2 = (height * 0.9) / 10;

  return (
    <BottomSheetModalProvider>
      <View style={styles.totalContainer}>
        {isSelectDay ? (
          <View>
            <View style={styles.smallCalendar}>
              <Calendar
                current={currentDay}
                markedDates={{
                  ...alcoholDays,
                  [selectDay]: {
                    selected: true,
                    marked: alcoholDays[selectDay] ? true : false,
                  },
                }}
                theme={{
                  "stylesheet.day.basic": {
                    base: {
                      height: height1,
                    },
                  },
                }}
                onDayPress={handleDayPress}
                onPressArrowLeft={handlePressArrowLeft}
                onPressArrowRight={handelPressArrowRight}
                style={styles.calenderStyle}
                // dayComponent={({ date, state }) => {
                //   console.log(`데이트 스트링은 이렇게 생김 ${date.dateString}`);
                //   console.log(`데이트는 이렇게 생김 ${date}`);

                //   const isAlcoholDay = alcoholDays[date.dateString];

                //   if (!isAlcoholDay) {
                //     // isAlcohol이 false이면 이미지를 띄우지 않음
                //     return (
                //       <View style={{ flex: 1 }}>
                //         <Text
                //           style={{
                //             textAlign: "center",
                //             color: state === "disabled" ? "gray" : "black",
                //           }}
                //         >
                //           {date.day}
                //         </Text>
                //       </View>
                //     );
                //   }

                //   const backgroundColor = "black"; // 이미지를 표시하는 날의 배경색

                //   return (
                //     <View style={{ flex: 1, backgroundColor }}>
                //       <ImageBackground
                //         source={getDrinkImageById(
                //           getIdByOnlyCategory(
                //             MonthlyData?.drinks[date.dateString]?.mainDrink
                //           )
                //         )}
                //         style={styles.imageContainer}
                //         resizeMode="contain"
                //       />
                //       <Text
                //         style={{
                //           textAlign: "center",
                //           color: state === "disabled" ? "gray" : "black",
                //         }}
                //       >
                //         {date.day}
                //       </Text>
                //     </View>
                //   );
                // }}
              />
            </View>
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
                  />
                ) : (
                  <View style={styles.tempBox}>
                    <View style={styles.headerBox}>
                      <Text style={styles.headerText}>{selectDay}</Text>
                    </View>
                    <View style={styles.dailySummaryTotal}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("RecordCreate", {
                            date: selectDay,
                            isAlcohol: alcoholDays[selectDay],
                          });
                        }}
                      >
                        <View style={styles.New}>
                          <Text style={styles.plus}>+</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </BottomSheetModal>
          </View>
        ) : (
          <View style={styles.largeCalendar}>
            <Calendar
              current={currentDay}
              markedDates={alcoholDays}
              theme={{
                "stylesheet.day.basic": {
                  base: {
                    alignSelf: "stretch",
                    alignItems: "center",
                    height: height2,
                  },
                },
              }}
              onDayPress={handleDayPress}
              onPressArrowLeft={handlePressArrowLeft}
              onPressArrowRight={handelPressArrowRight}
              style={styles.calenderStyle}
              // dayComponent={({ date, state }) => {
              //   console.log(`데이트 스트링은 이렇게 생김 ${date.dateString}`);
              //   console.log(`데이트는 이렇게 생김 ${date}`);

              //   const isAlcoholDay = alcoholDays[date.dateString];

              //   if (!isAlcoholDay) {
              //     // isAlcohol이 false이면 이미지를 띄우지 않음
              //     return (
              //       <View style={{ flex: 1 }}>
              //         <Text
              //           style={{
              //             textAlign: "center",
              //             color: state === "disabled" ? "gray" : "black",
              //           }}
              //         >
              //           {date.day}
              //         </Text>
              //       </View>
              //     );
              //   }

              //   const backgroundColor = "black"; // 이미지를 표시하는 날의 배경색

              //   return (
              //     <View style={{ flex: 1, backgroundColor }}>
              //       <ImageBackground
              //         source={getDrinkImageById(
              //           getIdByOnlyCategory(
              //             MonthlyData?.drinks[date.dateString]?.mainDrink
              //           )
              //         )}
              //         style={styles.imageContainer}
              //         resizeMode="contain"
              //       />
              //       <Text
              //         style={{
              //           textAlign: "center",
              //           color: state === "disabled" ? "gray" : "black",
              //         }}
              //       >
              //         {date.day}
              //       </Text>
              //     </View>
              //   );
              // }}
              // ㅇ헤헤
            />
          </View>
        )}
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
    height: "75%",
  },
  largeCalendar: {
    height: "100%",
  },
  dailySummaryComponent: {
    // height: "25%",
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
    // backgroundColor: "pink",
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
    // backgroundColor: "red",
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
});

export default CalendarSixWeeks;

// 기록을 추가/삭제 했을 때, 재 렌더링 로직 추가 필요
