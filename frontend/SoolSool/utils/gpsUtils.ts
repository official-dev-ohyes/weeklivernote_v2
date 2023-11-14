import { Linking, Alert, Platform } from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDistance } from "geolib";
import { updateNowGpsInfo } from "../api/gpsApi";
import * as Localization from "expo-localization";

interface LocationType {
	latitude: number;
	longitude: number;
	time?: number;
}

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
	// const today = new Date().toLocaleDateString('ko-KR').split("T")[0];
	const today = new Date()
		.toLocaleDateString(Localization.locale)
		.split("T")[0];
	console.log("현지 시간인지 확인 : ", today);

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
		const isPermissionDenied = await checkLocationPermission();
		return !isPermissionDenied;
	}
	return null;
}

export async function getLocation(): Promise<LocationType | null> {
	try {
		const location = await Location.getCurrentPositionAsync({
			accuracy: Location.Accuracy.Highest,
		});
		const latitude = location.coords.latitude;
		const longitude = location.coords.longitude;

		console.log("현재 위치 - 위도:", latitude, "경도:", longitude);

		return { latitude, longitude };
	} catch (error) {
		console.error("위치 정보를 가져오는 중 오류가 발생했습니다.", error);
		return null;
	}
}

export async function updateLocation(): Promise<boolean> {
	const nowLocation: LocationType = JSON.parse((await AsyncStorage.getItem("nowLocation")) || "{}");
	const destLocation: LocationType = JSON.parse((await AsyncStorage.getItem("destLocation")));
	const now = new Date(Localization.locale);

	console.log("현재 위치 : ", nowLocation);
	console.log("도착지 위치 : ", destLocation);
	
	let location: LocationType = nowLocation;

	if (getDistanceDiff(destLocation, location) <= 2) {
		return false;
	}

	if (Object.keys(nowLocation).length === 0) {
		location = await getLocation();
		if (location) {
			await AsyncStorage.setItem("nowLocation",	JSON.stringify({ ...location, time: now.getTime() }));
			const data = await updateNowGpsInfo(JSON.stringify(location));
			await AsyncStorage.setItem("alarmTime", data.alarmTime);
		}
	} else if (now.getTime() - (nowLocation.time || 0) >= 3600000) {
		console.log("1시간 이후");
		location = await getLocation();
		if (location && getDistanceDiff(nowLocation, location) >= 1) {
			console.log("1km 이상");
			await AsyncStorage.setItem(
				"nowLocation",
				JSON.stringify({ ...location, time: now.getTime() })
			);
			const data = await updateNowGpsInfo(JSON.stringify(location));
			await AsyncStorage.setItem("alarmTime", data.alarmTime);
		}
	}
	return true;
}

function getDistanceDiff(targetLocation, location) {
	const distance = getDistance(targetLocation, location);
	return distance / 1000;
}
