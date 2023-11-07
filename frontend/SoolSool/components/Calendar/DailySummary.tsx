import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { fetchDailyDrink } from "../../api/drinkRecordApi";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

import { getDrinkImageById, getIdByOnlyCategory } from "../../utils/drinkUtils";
import { ImageBackground } from "expo-image";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

function DailySummary(props) {
  const { summaryText, alcoholDays } = props;
  const [isAlcohol, setIsAlcohol] = useState<boolean>(false);
  const [dailyInfo, setDailyInfo] = useState({ totalDrink: 0, topConc: 0 });
  const [alcoholList, setAlcoholList] = useState([]);
  // console.log(`알코올 데이즈 ${alcoholDays}`);
  // 술 종류가 몇 개인지 알아오는 로직 추가하기
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useFocusEffect(
    React.useCallback(() => {
      setIsAlcohol(false);

      if (alcoholDays[summaryText]) {
        setIsAlcohol(true);
        fetchDailyDrink(summaryText)
          .then((res) => {
            console.log(res);
            setDailyInfo(res);
            let alcohols = [];
            for (let i = 0; i < res.drinks.length; i++) {
              alcohols.push(res.drinks[i]);
            }
            setAlcoholList(alcohols);
          })
          .catch((error) => {
            console.error("실패", error);
          });
      }
    }, [summaryText, navigation])
  );

  // console.log(`이 날짜의 이즈알코올은?! ${isAlcohol}`);

  return (
    <View style={styles.total}>
      {isAlcohol ? (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("DailyDetail", {
              summaryText,
              alcoholDays,
              isAlcohol: true,
            });
          }}
        >
          <View style={styles.headerBox}>
            <Text style={styles.headerText}>{summaryText}</Text>
          </View>
          <View style={styles.informations}>
            <View style={styles.category}>
              {alcoholList.slice(0, 3).map((alcohol, index) => (
                <View style={styles.eachAlcohol} key={index}>
                  <View style={styles.eachAlcoholIcon}>
                    <ImageBackground
                      source={getDrinkImageById(
                        getIdByOnlyCategory(alcohol.drink)
                      )}
                      style={styles.imageContainer}
                      resizeMode="contain"
                    />
                    {/* 잔 용량으로 나눠주기 */}
                    <Text style={styles.drinkStyle}>{alcohol.count} ml</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.textInformations}>
              <View style={styles.iconAndTextBox}>
                <MaterialCommunityIcons
                  name="cup-water"
                  size={24}
                  color="#0477BF"
                  marginRight={"7%"}
                />
                {/* <AntDesign
                  name="dashboard"
                  size={24}
                  color="black"
                  marginRight={"7%"}
                /> */}
                <Text style={styles.totalText}>
                  {dailyInfo.totalDrink}
                  <Text style={styles.unit}> ml</Text>
                </Text>
              </View>
              <View style={styles.iconAndTextBox}>
                <MaterialCommunityIcons
                  name="blood-bag"
                  size={24}
                  color="red" // @@@@@@@@@@@@@@@@@메인이랑 맞추자@@@@@@@@@@@@@@@@@
                  marginRight={"7%"}
                />
                <Text style={styles.totalText}>
                  {dailyInfo.topConc.toFixed(3)}
                  <Text style={styles.unit}> %</Text>
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("RecordCreate", {
              date: summaryText,
              isAlcohol: true,
            });
          }}
        >
          <View style={styles.headerBox}>
            <Text style={styles.headerText}>{summaryText}</Text>
          </View>
          <View style={styles.New}>
            <Text style={styles.plus}>+</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  total: {
    flex: 1,
    flexDirection: "column",
    // backgroundColor: "yellow",
    borderRadius: 10,
    padding: 5,
    justifyContent: "center",
    alignContent: "center",
    borderWidth: 2,
    borderColor: "#0477BF",
    backgroundColor: "#F6F6F6",
    margin: 5,
  },
  headerBox: {
    height: "25%",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
    // backgroundColor: "black",
  },
  headerText: {
    fontSize: 18,
    // fontFamily: "Yeongdeok-Sea",
  },
  informations: {
    height: "80%",
    flexDirection: "row",
    paddingBottom: 20,
  },
  category: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
    // backgroundColor: "yellow",
  },
  eachAlcohol: {
    height: "80%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    // paddingLeft: 5,
    // paddingRight: 5,
  },
  eachAlcoholIcon: {
    height: "80%",
    justifyContent: "center",
    // backgroundColor: "blue",
  },
  textInformations: {
    width: "50%",
    padding: 5,
    flexDirection: "column",
    justifyContent: "space-around",
    marginBottom: "3%",
    marginLeft: "5%",
    // backgroundColor: "pink",
  },
  iconAndTextBox: {
    flexDirection: "row",
    // backgroundColor: "black",
  },
  New: {
    height: "80%",
    justifyContent: "center",
    alignContent: "center",
    paddingBottom: "10%",
  },
  plus: {
    fontSize: 50,
    color: "#0477BF",
    textAlign: "center",
    textAlignVertical: "center", // 수직 가운데 정렬 (Android에서 사용)
    // flex: 1, // 수직 가운데 정렬 (iOS에서 사용)
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  imageContainer: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  drinkStyle: {
    textAlign: "center",
    fontSize: 15,
    // fontFamily: "Yeongdeok-Sea",
  },
  totalText: {
    fontSize: 20,
    // fontFamily: "Yeongdeok-Sea",
  },
  unit: {
    fontSize: 16,
    // fontFamily: "Yeongdeok-Sea",
  },
});

export default DailySummary;
