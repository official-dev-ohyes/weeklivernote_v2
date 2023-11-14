import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";

// import * as Notifications from "expo-notifications";

const RESET_TASK_NAME = "RESET_UPDATE_LOCATION_TASK";
const ALARM_TIME_TASK_NAME = "RESET_ALARM_TIME_TASK";

// 현재 시간이 새벽 5시인지 확인 후 keepUpdateLocation 초기화
TaskManager.defineTask(RESET_TASK_NAME, async () => {
	const now: Date = new Date(Localization.locale);
	console.log("지금 시간은?! ", now);

	// 작업이 수행되었다는 알림을 보냅니다.
	// 테스트 용
	// await Notifications.scheduleNotificationAsync({
	// 	content: {
	// 		title: "RESET_TASK_NAME",
	// 		body: "지금 시간은 " + now + "지금 값은? " + await AsyncStorage.getItem("keepUpdateLocation"),
	// 	},
	// 	trigger: null,
	// });
	// console.log("지금 값은!!", await AsyncStorage.getItem("keepUpdateLocation"));
	// await AsyncStorage.setItem("keepUpdateLocation", JSON.stringify(true));
	// console.log("바뀐 값은!!", await AsyncStorage.getItem("keepUpdateLocation"));

	if (now.getHours() >= 5) {
		try {
			await AsyncStorage.setItem("keepUpdateLocation", JSON.stringify(true));
		} catch (err) {
			console.error("keepUpdateLocation 값 초기화에 실패했습니다 : ", err);
		}
	}
});

// 막차 알림 시간이 지나면 keepUpdateLocation/alarmTime 초기화
TaskManager.defineTask(ALARM_TIME_TASK_NAME, async () => {
	const now: Date = new Date(Localization.locale);
	let alarmTime: string | null = null;

	try {
		alarmTime = await AsyncStorage.getItem("alarmTime");
	} catch (err) {
		console.error("alarmTime 값 조회에 실패했습니다 : ", err);
		return;
	}

	console.log("지금 시간은?! ", now);
	// let temp: Date | void = null;

	if (alarmTime) {
		const [alarmHour, alarmMinute] = alarmTime.split(":").map(Number);
		const alarmDateTime = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate(),
			alarmHour,
			alarmMinute
		);
		// temp = alarmDateTime

		console.log("알림 시간은 ?! : ", alarmDateTime);

		if (now.getTime() >= alarmDateTime.getTime()) {
			await AsyncStorage.setItem("keepUpdateLocation", JSON.stringify(true));
			await AsyncStorage.setItem("alarmTime", JSON.stringify(null));
		}
	}

	// 작업이 수행되었다는 알림을 보냅니다. - 테스트용
	// await Notifications.scheduleNotificationAsync({
	// 	content: {
	// 		title: "ALARM_TIME_TASK_NAME",
	// 		body: "지금 시간은 " + now + "알림 시간은 ?!" + temp + "  " + alarmTime,
	// 	},
	// 	trigger: null,
	// });
});



// 태스크 등록 및 백그라운드 패치 활성화
export const registerResetTask = async () => {
	const now: Date = new Date(Localization.locale);
	const currentHour = now.getHours();
	console.log("TASK 등록시 지금 시간은?! ", now);

	// 새벽 4시부터 6시 사이인 경우에만 태스크 등록
	if (currentHour >= 4 && currentHour < 6) {
		try {
			await BackgroundFetch.registerTaskAsync(RESET_TASK_NAME, {
				minimumInterval: 3600,
				stopOnTerminate: true,
				startOnBoot: true,
			});
		} catch (err) {
			console.error("TASK 등록에 실패하였습니다 : ", err);
		}
	}
	// // 테스트용
	// try {
	// 	await BackgroundFetch.registerTaskAsync(RESET_TASK_NAME, {
	// 		// minimumInterval: 3600,
	// 		minimumInterval: 120,
	// 		stopOnTerminate: true,
	// 		startOnBoot: true,
	// 	});
	// } catch (err) {
	// 	console.error("TASK 등록에 실패하였습니다 : ", err);
	// }
};

export const registerAlarmTimeResetTask = async () => {
	const now: Date = new Date(Localization.locale);
	const currentHour = now.getHours();
	console.log("TASK 등록시 지금 시간은?! ", now);

	// 저녁 7시부터 새벽 2시 사이인 경우에만 태스크 등록
	if (
		(currentHour >= 19 && currentHour <= 23) ||
		(currentHour >= 0 && currentHour < 2)
	) {
		try {
			await BackgroundFetch.registerTaskAsync(ALARM_TIME_TASK_NAME, {
				minimumInterval: 1800,
				stopOnTerminate: true,
				startOnBoot: true,
			});
		} catch (err) {
			console.error("TASK 등록에 실패하였습니다 : ", err);
		}
	}
};
