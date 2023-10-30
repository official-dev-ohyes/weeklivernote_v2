import { StyleSheet, Text, View } from "react-native";

function DailyDetail({ route }) {
  const { summaryText, userPicture, userMemo } = route.params;
  return (
    <View style={styles.check}>
      <View style={styles.summary}></View>
      <View style={styles.graph}></View>
      {userPicture && <View style={styles.userPicture}></View>}
      {userMemo && <View style={styles.userMemo}></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  check: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
  },
  summary: {
    // 이전 컴포넌트 내용 그대로
  },
  graph: {
    // 그래프는 나중에 가져오기
  },
  userPicture: {
    // 사용자의 사진이 있다면 표시
  },
  userMemo: {
    // 사용자의 메모가 있다면 표시
  },
});

export default DailyDetail;
