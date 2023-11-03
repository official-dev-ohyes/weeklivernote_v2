import React from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import { showErrorAndRetry } from "../utils/showErrorUtils";
import { Modal, Portal, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logOut, signOut } from "../api/accountApi";

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
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  const toggleNotification = () => {
    setIsNotificationEnabled(!isNotificationEnabled);
  };

  const handleGoToNotification = () => {
    navigation.navigate("Notification");
  };

  const handleLogOut = async () => {
    await logOut()
      .then(async (res) => {
        await AsyncStorage.removeItem("accessToken");
        navigation.navigate("Home");
      })
      .catch((err) => {
        showErrorAndRetry(
          "로그아웃 실패",
          "당신은 주간일기에서 나갈 수 없습니다."
        );
      });
  };

  const confirmSignOut = async () => {
    await signOut()
      .then((res) => {})
      .catch((err) => {
        showErrorAndRetry(
          "회원탈퇴 실패",
          "당신은 주간일기에서 나갈 수 없습니다."
        );
      })
      .finally(() => {
        hideModal();
      });
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
            <TouchableOpacity
              onPress={() =>
                showErrorAndRetry("준비 중😅", "업데이트 될 예정입니다.")
              }
            >
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
            <TouchableOpacity
              onPress={() =>
                showErrorAndRetry("준비 중😅", "업데이트 될 예정입니다.")
              }
            >
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
            <TouchableOpacity onPress={handleLogOut}>
              <Text>로그아웃</Text>
            </TouchableOpacity>
            <Separator />
            <TouchableOpacity onPress={showModal}>
              <Text>회원탈퇴</Text>
            </TouchableOpacity>
          </>
        }
      />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            width: "90%",
            borderRadius: 5,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <View style={styles.mainContainer}>
            <Text style={styles.alertTitle}>주간일기</Text>
            <View style={styles.textContainer}>
              <Text>정말 탈퇴하시겠습니까?</Text>
              <Text>모든 정보가 삭제됩니다.</Text>
            </View>
            <View style={styles.buttonContainer}>
              <Button mode="contained" onPress={confirmSignOut}>
                확인
              </Button>
              <Button mode="outlined" onPress={hideModal}>
                취소
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
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
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 5,
  },
  alertTitle: {
    fontSize: 20,
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
  },
});

export default SettingsScreen;
