import { StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import { fetchDailyDetail } from "../api/drinkRecordApi";
import { useEffect, useState } from "react";
import DailySummary from "../components/Calendar/DailySummary";
import { Modal, Portal, Button } from "react-native-paper";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { removeDrink } from "../api/drinkRecordApi";
import { useQuery } from "react-query";

function DailyDetailScreen({ route, navigation }) {
  const day = route.params.summaryText;
  const alcoholDays = route.params.alcoholDays;
  const isAlcohol = route.params.isAlcohol;
  const [isImg, setIsImg] = useState<boolean>(false);
  const [isModal, setIsModal] = useState<boolean>(false);

  const [info, setInfo] = useState({
    startTime: "",
    detoxTime: "",
    memo: "",
    img: "",
    hangover: "",
    drinks: {},
  });

  const {
    data: DailyDetailData,
    isLoading: dailyDetailLoading,
    isError: dailyDetailError,
  } = useQuery("DailyDetailQuery", async () => await fetchDailyDetail(day));

  useEffect(() => {
    if (DailyDetailData) {
      setInfo(DailyDetailData);
    }
  }, [DailyDetailData]);

  // 글 삭제 모달 및 삭제
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
          <MaterialCommunityIcons
            name="lightbulb-on-outline"
            size={30}
            color="black"
            onPress={() => {
              Alert.alert("알림", "05시를 기준으로 하루를 초기화합니다.");
            }}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            mode="contained"
            buttonColor={"#363C4B"}
            onPress={() => {
              navigation.navigate("RecordCreate", {
                date: day,
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
      </View>
      <View style={styles.summ}>
        <DailySummary
          summaryText={day}
          alcoholDays={alcoholDays}
          isAlcohol={isAlcohol}
        />
      </View>
      {/* <View style={styles.house}>
        <Text>그래프1</Text>
        <Text>그래프2</Text>
      </View> */}
      <View style={styles.house}>
        <Text style={styles.smallHeaderText}>술 자리 시작 시간</Text>
        <Text>{info.startTime.substring(11, 16)}</Text>
      </View>
      {isImg ? (
        <View style={styles.house}>
          <Text>사진</Text>
        </View>
      ) : null}
      <View style={styles.house}>
        <Text style={styles.smallHeaderText}>메모</Text>
        {info.memo ? (
          <Text style={styles.innerText}>{info.memo}</Text>
        ) : (
          <Text style={styles.innerText}>작성된 메모가 없어요</Text>
        )}
      </View>
      <Portal>
        <Modal
          visible={isModal}
          onDismiss={hideDeleteModal}
          style={styles.containerStyle}
        >
          <Text style={styles.deleteText}>
            {day} 음주 기록을 삭제하시겠습니까?
          </Text>
          <View style={styles.deleteButtons}>
            <Button
              mode="contained"
              onPress={confirmDelete}
              buttonColor={"#363C4B"}
            >
              삭제
            </Button>
            <Button
              mode="contained"
              onPress={hideDeleteModal}
              buttonColor={"#363C4B"}
            >
              취소
            </Button>
          </View>
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
    // backgroundColor: "pink",
  },
  house: {
    borderWidth: 2,
    borderColor: "#363C4B",
    backgroundColor: "#F6F6F6",
    borderRadius: 5,
    margin: 5,
    marginTop: "5%",
    padding: "3%",
  },
  containerStyle: {
    backgroundColor: "white",
    padding: 20,
  },
  smallHeaderText: {
    fontSize: 17,
    marginBottom: "2%",
  },
  innerText: {
    fontSize: 15,
  },
  deleteText: {
    fontSize: 17,
    textAlign: "center",
  },
  deleteButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: "15%",
  },
  botton: {
    margin: "1%",
  },
});

export default DailyDetailScreen;
