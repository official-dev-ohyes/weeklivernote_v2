import { Platform } from "react-native";
import { isDevice } from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const expoPushToken = AsyncStorage.getItem("expoPushToken");

export async function registerForPushNotificationsAsync() {
  let token;

  if (isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })
    ).data;

    // console.log(token);
  } else {
    alert("알림을 받기 위해서는 실제 기기를 이용해주세요.");
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export async function scheduleAlcoholLimitLocalNotification(status: number) {
  let notificationBody: string;
  switch (status) {
    case 1:
      notificationBody = "벌써 주량의 절반을 마셨어요.";
      break;
    case 2:
      notificationBody = "슬슬 한계에 가까워지고 있어요.";
      break;
    case 3:
      notificationBody = "오늘은 그만 마시는게 어떨까요?";
      break;
    default:
      notificationBody = "Drink Mindfully!";
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Drink Mindfully!",
      body: notificationBody,
      data: { data: "" },
    },
    trigger: { seconds: 1 },
  });
  console.log("Notification: ", notificationBody);
}
