import { StyleSheet, Text, View } from "react-native";
import { fetchDailyDetail } from "../api/drinkRecordApi";
import { useEffect, useState } from "react";
import DailySummary from "../components/Calendar/DailySummary";
import { Modal, Portal, Button, PaperProvider } from "react-native-paper";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { removeDrink } from "../api/drinkRecordApi";

function DailyDetailScreen({ route, navigation }) {
  const day = route.params.summaryText;
  const alcoholDays = route.params.alcoholDays;
  const isAlcohol = route.params.isAlcohol;
  const [isImg, setIsImg] = useState<boolean>(false);
  const [isModal, setIsModal] = useState<boolean>(false);

  console.log(
    `날짜는 ${day}, 술마신날들은 ${alcoholDays}, 알코올상태는? ${isAlcohol}`
  );

  const [info, setInfo] = useState({
    startTime: "",
    detoxTime: "",
    memo: "",
    img: "",
    hangover: "",
    drinks: {},
  });

  useEffect(() => {
    const setAndFetch = async () => {
      console.log(`요청날짜는 ${day}`);
      fetchDailyDetail(day)
        .then((res) => {
          setInfo(res);
          if (res.img) {
            setIsImg(true);
          }
          console.log(res);
        })
        .catch((err) => {
          console.error("실패", err);
        });
    };
    setAndFetch();
  }, []);

  const openDeleteModal = () => {
    setIsModal(true);
  };

  const hideDeleteModal = () => {
    setIsModal(false);
  };

  const confirmDelete = () => {
    removeDrink(day);
    hideDeleteModal();
    navigation.navigate("Calendar");
  };

  return (
    <View style={styles.total}>
      <View style={styles.mainTextBox}>
        <Text style={styles.headerText}>술력</Text>
        <View style={styles.light}>
          {/* 아래 클릭 시 새벽 5시 기준 초기화 정보 띄워주기 */}
          <MaterialCommunityIcons
            name="lightbulb-on-outline"
            size={30}
            color="black"
          />
        </View>
        <View style={styles.buttons}>
          {/* <Button
            mode="contained"
            onPress={() => {
              navigation.navigate("RecordCreate", {
                date: day,
                isAlcohol: true,
              });
            }}
          >
            수정
          </Button> */}
          <Button mode="contained" onPress={openDeleteModal}>
            삭제
          </Button>
        </View>
      </View>
      <View style={styles.summ}>
        <DailySummary
          summaryText={day}
          alcoholDays={alcoholDays}
          isAlcohol={isAlcohol}
        />
      </View>
      <View style={styles.house}>
        <Text>그래프1</Text>
        <Text>그래프2</Text>
      </View>
      <View style={styles.house}>
        <Text>시간? 숙취증상</Text>
      </View>
      {isImg ? (
        <View style={styles.house}>
          <Text>사진</Text>
        </View>
      ) : null}
      <View style={styles.house}>
        <Text>메모</Text>
        <Text>{info.memo}</Text>
      </View>
      <Portal>
        <Modal
          visible={isModal}
          onDismiss={hideDeleteModal}
          style={styles.containerStyle}
        >
          <Text>{day} 음주 기록을 삭제하시겠습니까?</Text>
          <Button onPress={confirmDelete}>삭제</Button>
          <Button onPress={hideDeleteModal}>취소</Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  total: {
    height: "80%",
    flex: 1,
  },
  mainBackground: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black",
  },
  mainTextBox: {
    height: "15%",
    padding: "5%",
    flexDirection: "row",
    alignItems: "flex-end",
    // backgroundColor: "pink",
  },
  headerText: {
    fontSize: 40,
    fontFamily: "Yeongdeok-Sea",
    verticalAlign: "bottom",
  },
  light: {
    height: "80%",
    // backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "2%",
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  summ: {
    height: "20%",
  },
  house: {
    borderWidth: 2,
    borderColor: "black",
    margin: 5,
  },
  containerStyle: {
    backgroundColor: "white",
    padding: 20,
  },
});

export default DailyDetailScreen;
