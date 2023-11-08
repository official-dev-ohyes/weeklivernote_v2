import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

function NowAddedAlcohols({ alcoholRecord }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(alcoholRecord.length);
    for (let i = 0; i < alcoholRecord.length; i++) {}
  }, [alcoholRecord.length]);

  console.log(`지금 넘어온 술 기록 개수는 ${count}개`);

  return (
    <View style={styles.total}>
      <View style={styles.oneline}>
        {alcoholRecord.slice(0, 4).map((record, index) => (
          <View key={index} style={styles.alcoholInfo}>
            <Text style={styles.innerText}>
              {record.category}
              <Text style={styles.innerText}> {record.drinkAmount}</Text>
              <Text style={styles.innerText}>{record.drinkUnit} </Text>
            </Text>
          </View>
        ))}
      </View>
      {count > 4 && (
        <View style={styles.oneline}>
          {alcoholRecord.slice(4).map((record, index) => (
            <View key={index} style={styles.alcoholInfo}>
              <Text>
                {record.category}
                <Text> {record.drinkAmount}</Text>
                <Text>{record.drinkUnit} </Text>
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  total: {
    flex: 1,
  },
  oneline: {
    flex: 0.5,
    flexDirection: "row",
  },
  alcoholInfo: {
    margin: "1%",
    padding: "1%",
    backgroundColor: "white",
    flexDirection: "row",
    borderRadius: 5,
  },
  innerText: {
    fontSize: 14,
    // fontFamily: "Yeongdeok-Sea",
  },
});

export default NowAddedAlcohols;
