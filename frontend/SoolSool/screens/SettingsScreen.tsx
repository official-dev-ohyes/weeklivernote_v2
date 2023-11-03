import React from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";

function Section({ title, content }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.content}>{content}</View>
    </View>
  );
}

function Separator() {
  return (
    <View style={styles.separator}>
      <Text style={styles.line}></Text>
    </View>
  );
}

function SettingsScreen({ navigation }) {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

  const toggleNotification = () => {
    setIsNotificationEnabled(!isNotificationEnabled);
  };

  const handleGoToNotification = () => {
    navigation.navigate("Notification");
  };

  return (
    <View style={styles.container}>
      <Section
        title="알림"
        content={
          <View style={styles.alarmContainer}>
            <Text>알림 켜기</Text>
            <Switch
              value={isNotificationEnabled} // 알림 켜기 또는 끄기 값 설정
              onValueChange={toggleNotification} // 알림 켜기 또는 끄기 이벤트 핸들러
            />
          </View>
        }
      />

      <Section
        title="주간일기 1.0.0"
        content={
          <>
            <TouchableOpacity onPress={handleGoToNotification}>
              <Text>공지사항</Text>
            </TouchableOpacity>
            <Separator />
            <TouchableOpacity>
              <Text>문의하기</Text>
            </TouchableOpacity>
          </>
        }
      />

      <Section
        title="이용약관"
        content={
          <>
            <TouchableOpacity>
              <Text>서비스 이용약관</Text>
            </TouchableOpacity>
            <Separator />
            <TouchableOpacity>
              <Text>위치정보 이용약관</Text>
            </TouchableOpacity>
            <Separator />
            <TouchableOpacity>
              <Text>개인정보 처리방침</Text>
            </TouchableOpacity>
          </>
        }
      />

      <Section
        title="계정관리"
        content={
          <>
            <TouchableOpacity>
              <Text>로그아웃</Text>
            </TouchableOpacity>
            <Separator />
            <TouchableOpacity>
              <Text>회원탈퇴</Text>
            </TouchableOpacity>
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F6F6F6",
    padding: 10,
  },
  alarmContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "red",
  },
  separator: {
    alignItems: "center",
  },
  line: {
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    width: "100%",
    marginBottom: 25,
  },
});

export default SettingsScreen;
