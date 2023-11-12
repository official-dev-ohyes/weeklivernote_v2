import { Linking, Alert, Platform } from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getFirstLocationPermission() {
	console.log("firstLanch 확인 함수 시작");
	const isFirstLaunch = await AsyncStorage.getItem("isFirstLaunch");
	console.log("isFirstLaunch 값 : ", isFirstLaunch);
	if (isFirstLaunch === null) {
    console.log("isFirstLaunch null 인지 재확인", isFirstLaunch);
		await Location.requestForegroundPermissionsAsync();
		AsyncStorage.setItem("isFirstLaunch", "false");
	}
}

export async function checkLocationPermission() {
	const { status } = await Location.getForegroundPermissionsAsync();
	return status !== "granted";
}

export async function locationPermissionAlert() {
	const lastCheckedDate = await AsyncStorage.getItem("lastCheckedDate");
	const today = new Date().toISOString().split("T")[0];

	if (!lastCheckedDate || lastCheckedDate !== today) {
		Alert.alert(
			"위치 권한이 필요합니다",
			"막차 알림 서비스를 이용하려면 위치 정보가 필요합니다. 설정에서 위치 권한을 허용해주세요.",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "OK",
					onPress: () => {
						if (Platform.OS === "ios") {
							Linking.openURL("app-settings:");
						} else {
							Linking.openSettings();
						}
					},
				},
			]
			);
		AsyncStorage.setItem("lastCheckedDate", today);
		return;
	}
	return;
}
