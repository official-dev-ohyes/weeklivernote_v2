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

