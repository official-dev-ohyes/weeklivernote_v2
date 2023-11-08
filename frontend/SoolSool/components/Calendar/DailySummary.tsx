import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { fetchDailyDrink } from "../../api/drinkRecordApi";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

import {
  getDrinkImageById,
  getIdByOnlyCategory,
  getShotAmountByDrinkCOunt,
} from "../../utils/drinkUtils";
import { ImageBackground } from "expo-image";
import { Icon, MD3Colors } from "react-native-paper";

function DailySummary(props) {
  const { summaryText, alcoholDays } = props;
  const [isAlcohol, setIsAlcohol] = useState<boolean>(false);
  const [dailyInfo, setDailyInfo] = useState({ totalDrink: 0, topConc: 0 });
  const [alcoholList, setAlcoholList] = useState([]);
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
      // else {
      //   setIsAlcohol(false);
      // }
    }, [summaryText, navigation])
  );

  console.log(
    `날짜를 확인합시다!!!! ${summaryText} 알코올 마신 날이다 참 거짓!!!!!!!! ${isAlcohol}`
  );

  return (
    <View style={styles.total}>
      {isAlcohol ? (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("DailyDetail", {
              summaryText,
              alcoholDays,
              isAlcohol: isAlcohol,
            });
          }}
        >
          <View style={styles.headerBox}>
            <Text style={styles.headerText}>{summaryText}</Text>
          </View>
          <View style={styles.informations}>
            {/* 마신 술을 세 종류 까지 종류/잔 보여주기 -> 백엔드에 정렬 로직 추가 요청 상태 */}
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
                    <Text style={styles.drinkStyle}>
                      {getShotAmountByDrinkCOunt(alcohol.drink, alcohol.count)}
                      잔
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            {/* 우측 문자 총량, 최대 혈중알코올농도 수치 */}
            <View style={styles.textInformations}>
              <View style={styles.iconAndTextBox}>
                <Icon source="cup-water" size={24} color="#0477BF" />
                <Text style={styles.totalText}>
                  {dailyInfo.totalDrink}
                  <Text style={styles.unit}> ml</Text>
                </Text>
              </View>
              <View style={styles.iconAndTextBox}>
                <Icon source="blood-bag" size={24} color={MD3Colors.error50} />
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
              isAlcohol: isAlcohol,
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
    borderRadius: 10,
    padding: 5,
    justifyContent: "center",
    alignContent: "center",
    borderWidth: 2,
    borderColor: "#363C4B",
    backgroundColor: "#F6F6F6",
    margin: 5,
  },
  headerBox: {
    height: "25%",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
  },
  headerText: {
    fontSize: 18,
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
  },
  eachAlcohol: {
    height: "80%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eachAlcoholIcon: {
    height: "80%",
    justifyContent: "center",
  },
  textInformations: {
    width: "50%",
    padding: 5,
    flexDirection: "column",
    justifyContent: "space-around",
    marginBottom: "3%",
    marginLeft: "5%",
  },
  iconAndTextBox: {
    flexDirection: "row",
  },
  New: {
    height: "80%",
    justifyContent: "center",
    alignContent: "center",
    paddingBottom: "10%",
  },
  plus: {
    fontSize: 50,
    color: "#363C4B",
    textAlign: "center",
    textAlignVertical: "center", // Android
    // flex: 1, // iOS
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
  },
  totalText: {
    fontSize: 20,
  },
  unit: {
    fontSize: 16,
  },
});

export default DailySummary;
