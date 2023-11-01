import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { fetchDailyDetail } from "../api/drinkRecordApi";
import { useEffect, useState } from "react";
import DailySummary from "../components/Calendar/DailySummary";

function DailyDetailScreen({ route }) {
  const day = route.params.summaryText;
  const alcoholDays = route.params.alcoholDays;
  const isAlcohol = route.params.isAlcohol;
  const [isImg, setIsImg] = useState<boolean>(false);

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

  return (
    <View style={styles.total}>
      <View style={styles.header}>
        <Text>술력</Text>
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
      {/* <Text>{day}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  total: {
    height: "80%",
    flex: 1,
  },
  header: {
    height: "15%",
    backgroundColor: "red",
  },
  summ: {
    height: "20%",
  },
  house: {
    borderWidth: 2,
    borderColor: "black",
    margin: 5,
  },
});

export default DailyDetailScreen;
