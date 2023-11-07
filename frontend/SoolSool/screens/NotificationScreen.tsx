import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useQuery } from "react-query";
import { fetchNotice } from "../api/noticeApi";

// const noticeData = [
//   { id: 1, title: "😋", content: "이것은 첫 번째 공지사항입니다." },
//   { id: 2, title: "😐", content: "두 번째 공지사항 내용입니다." },
//   { id: 3, title: "😯", content: "세 번째 공지사항 내용입니다." },
// ];

function NotificationCard({ title, content }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardContent}>{content}</Text>
    </View>
  );
}

function NotificationScreen() {
  const [noticeData, setNoticeData] = useState(null);

  const { data: notificationData, isLoading } = useQuery(
    "notificationData",
    async () => await fetchNotice()
  );

  useEffect(() => {
    console.log("공지사항 확인용", notificationData.notices);
    setNoticeData(notificationData.notices);
  }, [notificationData]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>공지사항</Text>
      {noticeData?.map((notice) => (
        <NotificationCard
          key={notice.id}
          title={notice.title}
          content={notice.content}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F6F6F6",
    padding: 10,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardContent: {
    fontSize: 16,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default NotificationScreen;
