import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useState } from "react";
import ModalDropdown from "react-native-modal-dropdown";
import NowAddedAlcohols from "../components/Calendar/NowAddedAlcohols";

function RecordCreateScreen({ route }) {
  const day = route.params.date;
  const [alcoholRecord, setAlcoholRecord] = useState([]);
  const [alcohol, setAlcohol] = useState("");
  const [memo, setMemo] = useState("");
  const [selectedAlcohol, setSelectedAlcohol] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const alcoholCategory = [
    "소주",
    "맥주",
    "소맥",
    "와인",
    "하이볼",
    "막걸리",
    "칵테일(약)",
    "칵테일(강)",
    "위스키",
  ];
  const amountCategory = ["잔", "병"];

  return (
    <View style={styles.total}>
      <View style={styles.header}>
        <Text>{day}</Text>
      </View>
      <View style={styles.contents}>
        <View style={styles.tagArea}>
          <NowAddedAlcohols alcoholRecord={alcoholRecord} />
        </View>
        <View style={styles.alcoholArea}>
          <View style={styles.alcoholInput}>
            <Text style={styles.word}>술</Text>
            <View style={styles.category}>
              <ModalDropdown
                options={alcoholCategory}
                onSelect={(index, value) => setSelectedAlcohol(value)}
              />
            </View>
          </View>
          <View style={styles.alcoholInput}>
            <Text style={styles.word}>양</Text>
            <View style={styles.alcoholAmount}>
              <TextInput
                placeholder="숫자를 입력하세요"
                keyboardType="numeric"
                value={alcohol}
                onChangeText={(text) => setAlcohol(text)}
              />
            </View>
            <View style={styles.alcoholAmount}>
              <ModalDropdown
                options={amountCategory}
                onSelect={(index, value) => setSelectedUnit(value)}
              />
            </View>
          </View>
          {/* addinfoscreen 참조해서 버튼 예쁘게 만들기 */}
          <Button
            icon="camera"
            mode="contained"
            onPress={() => {
              const newRecord = {
                category: selectedAlcohol,
                amount: alcohol,
                unit: selectedUnit,
              };
              setAlcoholRecord([...alcoholRecord, newRecord]);
              setAlcohol("");
              console.log(alcoholRecord);
            }}
          >
            추가
          </Button>
        </View>
        <View style={styles.time}>
          <Text style={styles.timeHeader}>술자리 시작</Text>
          <View style={styles.timer}>
            <Text>PM</Text>
            {/* 숫자 입력창1 */}
            {/* 숫자 입력창2 */}
          </View>
        </View>
        <View style={styles.memo}>
          <View>
            <Text>사진 입력 자리</Text>
          </View>
          <Text>Memo</Text>
          {/* 한글 입력이 안돼요ㅠㅠ */}
          <TextInput
            label="술자리 기록을 남겨보세요"
            keyboardType="default"
            mode="outlined"
            value={memo}
            onChangeText={(memo) => setMemo(memo)}
            multiline={true}
            numberOfLines={9}
          />
        </View>
        <Button icon="camera" mode="contained">
          저장
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  total: {
    flex: 1,
    // backgroundColor: "black",
  },
  header: {
    height: "15%",
    backgroundColor: "pink",
  },
  contents: {
    height: "85%",
    backgroundColor: "yellow",
    padding: 10,
    justifyContent: "space-around",
  },
  tagArea: {
    height: "10%",
    backgroundColor: "white",
  },
  alcoholArea: {
    height: "25%",
    backgroundColor: "white",
    // 수직방향 정렬 맞추기
  },
  alcoholInput: {
    height: "32%",
    margin: "1%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "skyblue",
  },
  word: {
    flex: 1,
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
    textAlign: "center",
  },
  category: {
    flex: 4,
    height: "90%",
    margin: "1%",
    backgroundColor: "yellow",
  },
  // @@@@@@@@@@@@@@@@@@@@@나중에 세밀하게 수정하기@@@@@@@@@@@@@@@@@@@@@
  alcoholAmount: {
    flex: 1.9,
    height: "90%",
    marginTop: "1%",
    marginBottom: "1%",
    marginRight: "0.5%",
    backgroundColor: "white",
  },
  time: {
    display: "flex",
    flexDirection: "row",
    height: "10%",
    backgroundColor: "white",
  },
  timeHeader: {
    flex: 3,
  },
  timer: {
    flex: 7,
    backgroundColor: "purple",
  },
  memo: {
    height: "40%",
    backgroundColor: "white",
  },
  record: {
    backgroundColor: "lightgrey",
    marginVertical: 5,
    padding: 10,
  },
});

export default RecordCreateScreen;
