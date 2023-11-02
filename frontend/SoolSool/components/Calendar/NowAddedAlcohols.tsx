import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

function NowAddedAlcohols({ alcoholRecord }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(alcoholRecord.length);
    for (let i = 0; i < alcoholRecord.length; i++) {
      console.log(`넘어온 정보${i + 1}번째!`);
      console.log("술 종류:", alcoholRecord[i].category);
      console.log("양:", alcoholRecord[i].amount);
      console.log("단위:", alcoholRecord[i].unit);
    }
  }, [alcoholRecord]);

  console.log(`지금 넘어온 술 기록 개수는 ${count}개`);

  return (
    <View style={styles.total}>
      <View style={styles.oneline}>
        {alcoholRecord.slice(0, 4).map((record, index) => (
          <View key={index} style={styles.alcoholInfo}>
            <Text>
              {record.category}
              <Text> ({record.unit}) </Text>
            </Text>
            <Text>{record.amount}</Text>
          </View>
        ))}
      </View>
      {count > 4 && (
        <View style={styles.oneline}>
          {alcoholRecord.slice(4).map((record, index) => (
            <View key={index} style={styles.alcoholInfo}>
              <Text>
                {record.category}
                <Text> ({record.unit}) </Text>
              </Text>
              <Text>{record.amount}</Text>
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
    // backgroundColor: "black",
  },
  oneline: {
    flex: 0.5,
    flexDirection: "row",
    // backgroundColor: "blue",
  },
  alcoholInfo: {
    margin: "1%",
    padding: "1%",
    backgroundColor: "pink",
    flexDirection: "row",
  },
});

export default NowAddedAlcohols;
