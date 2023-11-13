import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { fetchDailyDrink, removeDrink } from "../../api/drinkRecordApi";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

import {
  getDrinkImageById,
  getIdByOnlyCategory,
  getShotAmountByDrinkCOunt,
} from "../../utils/drinkUtils";
import { ImageBackground } from "expo-image";
import { Button, Icon, MD3Colors, Modal, Portal } from "react-native-paper";
import { useQuery, useQueryClient } from "react-query";

import DailyDetail from "./DailyDetail";

function DailySummary(props) {
  console.log(`지금 선택된 요약 정보 날짜를 확인합시다! ${props.summaryText}`);

  const today = new Date();
  const queryClient = useQueryClient();
  const { summaryText, alcoholDays } = props;
  const [isAlcohol, setIsAlcohol] = useState<boolean>(false);
  const [dailyInfo, setDailyInfo] = useState({ totalDrink: 0, topConc: 0 });
  const [alcoholList, setAlcoholList] = useState([]);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [isModal, setIsModal] = useState<boolean>(false);

  const {
    data: DailyDrinkData,
    isLoading: DailyDrinkLoading,
    isError: DailyDrinkError,
  } = useQuery(
    ["DailyDrinkQuery", summaryText], // 두번째에 의존성 추가 가능
    async () => await fetchDailyDrink(summaryText),
    {
      enabled: isAlcohol, // 조건부 활성화
    }
  );

  useFocusEffect(
    React.useCallback(() => {
      setIsAlcohol(false);

      if (alcoholDays[summaryText]) {
        setIsAlcohol(true);
        if (DailyDrinkData) {
          setDailyInfo(DailyDrinkData);
          let alcohols = [];
          for (let i = 0; i < DailyDrinkData.drinks.length; i++) {
            alcohols.push(DailyDrinkData.drinks[i]);
          }
          setAlcoholList(alcohols);
        }
      }
      // }, [summaryText, navigation, DailyDrinkData])
    }, [DailyDrinkData, navigation])
  );

  // 글 삭제 모달 및 삭제
  const openDeleteModal = () => {
    setIsModal(true);
  };
  const hideDeleteModal = () => {
    setIsModal(false);
  };
  const confirmDelete = () => {
    removeDrink(summaryText);
    hideDeleteModal();
    navigation.navigate("Calendar");
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.box}>
        <View style={styles.header}>
          <View style={styles.headerBox}>
            <Text style={styles.headerText}>{summaryText}</Text>
          </View>
          {isAlcohol ? (
            <View style={styles.buttons}>
              <Button
                mode="outlined"
                onPress={() => {
                  navigation.navigate("RecordCreate", {
                    date: summaryText,
                    isAlcohol: true,
                  });
                }}
                style={styles.botton}
              >
                수정
              </Button>
              <Button
                mode="contained"
                onPress={openDeleteModal}
                buttonColor={"#363C4B"}
                style={styles.botton}
              >
                삭제
              </Button>
            </View>
          ) : null}
        </View>

        <View style={styles.total}>
          <View>
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
                        {getShotAmountByDrinkCOunt(
                          alcohol.drink,
                          alcohol.count
                        )}
                        잔
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
              <View style={styles.textInformations}>
                <View style={styles.iconAndTextBox}>
                  <Icon source="cup-water" size={24} color="#0477BF" />
                  <Text style={styles.totalText}>
                    {dailyInfo.totalDrink}
                    <Text style={styles.unit}> ml</Text>
                  </Text>
                </View>
                <View style={styles.iconAndTextBox}>
                  <Icon
                    source="blood-bag"
                    size={24}
                    color={MD3Colors.error50}
                  />
                  <Text style={styles.totalText}>
                    {dailyInfo.topConc.toFixed(3)}
                    <Text style={styles.unit}> %</Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.detail}>
        <DailyDetail
          summaryText={summaryText}
          alcoholDays={alcoholDays}
          isAlcohol={isAlcohol}
          navigation={navigation}
        />
      </View>
      <Portal>
        <Modal
          visible={isModal}
          onDismiss={hideDeleteModal}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            width: "90%",
            borderRadius: 5,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <View style={styles.mainContainer}>
            <Text style={styles.alertTitle}>주간일기</Text>
            <View style={styles.textContainer}>
              <Text>정말 삭제하시겠습니까?</Text>
            </View>
            <View style={styles.buttonContainer}>
              <Button mode="outlined" onPress={hideDeleteModal}>
                취소
              </Button>
              <Button
                mode="contained"
                buttonColor={"#363C4B"}
                onPress={confirmDelete}
              >
                삭제
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    height: "20%",
  },
  header: {
    flexDirection: "row",
    height: "30%",
    marginLeft: "5%",
    marginRight: "5%",
  },
  headerBox: {
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  // headerText: {
  //   fontSize: 20,
  //   color: "#363C4B",
  //   fontFamily: "Yeongdeok-Sea",
  // },
  total: {
    height: "75%",
    borderRadius: 5,
    backgroundColor: "#ffffff",
    width: "95%",
    marginRight: "auto",
    marginLeft: "auto",
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
  buttons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  deleteButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: "15%",
  },
  botton: {
    margin: "1%",
    // flex: 1,
  },
  headerText: {
    fontSize: 18,
    color: "#363C4B",
    fontFamily: "LineRegular",
  },
  informations: {
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
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
    height: "90%",
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
  detail: {
    height: "80%",
    // backgroundColor: "yellow",
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 5,
  },
  alertTitle: {
    fontSize: 20,
  },
});

export default DailySummary;
