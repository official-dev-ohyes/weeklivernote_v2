import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import NewRecord from "./NewRecord";
import { fetchDailyDrink } from "../../api/calendarApi";

function DailySummary({ summaryText, alcoholDays }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [dailyModalVisible, setDailyModalVisible] = useState(false);
  const [isAlcohol, setIsAlcohol] = useState<boolean>(false);
  const [alcoholList, setAlcoholList] = useState([]);
  // 클릭 시 상세 페이지로 이동
  // 술 종류가 몇 개인지 알아오는 로직 추가하기
  const navigation = useNavigation();

  useEffect(() => {
    setIsAlcohol(false);

    if (alcoholDays.includes(summaryText)) {
      setIsAlcohol(true);
      fetchDailyDrink(summaryText)
        .then((res) => {
          let alcohols = [];
          for (let i = 0; i < res.drinks.length; i++) {
            alcohols.push(res.drinks[i]);
          }
          setAlcoholList(alcohols);
          console.log(alcohols);
        })
        .catch((error) => {
          console.error("실패", error);
        });
    }
  }, [summaryText]);

  return (
    <View style={styles.total}>
      {isAlcohol ? (
        <TouchableOpacity onPress={() => setDailyModalVisible(true)}>
          <View style={styles.headerBox}>
            <Text style={styles.headerText}>{summaryText}</Text>
          </View>
          <View style={styles.informations}>
            <View style={styles.category}>
              <View style={styles.eachAlcohol}>
                {/* 나중에 여기에 술 아이콘 넣기 */}
                <View style={styles.eachAlcoholIcon}>
                  <Text>아이콘1</Text>
                </View>
                <Text>수량</Text>
              </View>
              <Text>아이콘2</Text>
              <Text>아이콘3</Text>
            </View>
            <View style={styles.textInformations}>
              <Text>총량</Text>
              <Text>최대 알코올 수치</Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.headerBox}>
            <Text style={styles.headerText}>{summaryText}</Text>
          </View>
          <View style={styles.New}>
            <Text style={styles.plus}>+</Text>
          </View>
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalView}>
          <NewRecord /> {/* 모달 내부에 NewRecord 컴포넌트 표시 */}
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}
          >
            <Text style={styles.closeButton}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  },
  headerBox: {
    height: "20%",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
    // backgroundColor: "black",
  },
  headerText: {
    // 높이의 몇 퍼센트로 하고 싶은걸
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
    backgroundColor: "blue",
  },
  textInformations: {
    width: "50%",
    padding: 5,
    flexDirection: "column",
    justifyContent: "space-around",
  },
  New: {
    height: "80%",
    justifyContent: "center",
    alignContent: "center",
    paddingBottom: "10%",
  },
  plus: {
    fontSize: 50,
    color: "black",
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
});

export default DailySummary;
