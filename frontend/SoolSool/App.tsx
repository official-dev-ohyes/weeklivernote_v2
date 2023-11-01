import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { QueryClient, QueryClientProvider } from "react-query";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LoginScreen from "./screens/LoginScreen";
import AddInfoScreen from "./screens/AddInfoScreen";
import HomeScreen from "./screens/HomeScreen";
import CalendarScreen from "./screens/CalendarScreen";
// import MapScreen from "./screens/MapScreen";
import MyPageScreen from "./screens/MyPageScreen";
import SettingsScreen from "./screens/SettingsScreen";
import KakaoLoginScreen from "./screens/KakaoLoginScreen";
import { RecoilRoot } from "recoil";
import AddInfoStep2Screen from "./screens/AddInfoStep2Screen";
import AddInfoStep3Screen from "./screens/AddInfoStep3Screen";
import { useEffect, useState } from "react";
import * as Font from "expo-font";
import { mainFontTTF } from "./assets";

import DailyDetailScreen from "./screens/DailyDetailScreen";
import RecordCreateScreen from "./screens/RecordCreateScreen";
// @@@@@@@@@@@@@@@@@@@@여기에 임포트 하고@@@@@@@@@@@@@@@@@@@@

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const queryClient = new QueryClient();

function BottomTabNavigator() {
  const [isFont, setIsFont] = useState(false);

  useEffect(async () => {
    await Font.loadAsync({
      mainFont: mainFontTTF,
      // "custom-font-otf": require("../assets/font/Yeongdeok_Sea.otf"),
    });
    setIsFont(true);
  }, []);

  return (
    <BottomTab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#0477BF" },
        headerTintColor: "white",
        tabBarShowLabel: false,
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-home-sharp" color={color} size={size} />
          ),
          title: "Home",
        }}
      />
      <BottomTab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-calendar-sharp" color={color} size={size} />
          ),
          title: "Calender",
        }}
      />
      {/* <BottomTab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" color={color} size={size} />
          ),
                    title: "지도",
        }}
      /> */}
      <BottomTab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
          title: "MyPage",
        }}
      />
    </BottomTab.Navigator>
  );
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // 커스텀 색상 설정
    // primary: 'tomato',
    mainPink: "#F2A7C3",
    mainBlue: "#0477BF",
    mainGreen: "#03A678",
    mainYellow: "#F2D06B",
    mainRed: "#F25E5E",
  },
};

export default function App() {
  return (
    <RecoilRoot>
      <PaperProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          {/* <SafeAreaView style={styles.rootScreen}> */}
          <View style={styles.rootScreen}>
            <StatusBar style="dark" />
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                }}
                initialRouteName="Login"
              >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen
                  name="KakaoLoginScreen"
                  component={KakaoLoginScreen}
                />
                <Stack.Screen name="AddInfo" component={AddInfoScreen} />
                <Stack.Screen
                  name="AddInfoStep2"
                  component={AddInfoStep2Screen}
                />
                <Stack.Screen
                  name="AddInfoStep3"
                  component={AddInfoStep3Screen}
                />
                <Stack.Screen name="BottomTab" component={BottomTabNavigator} />
                <Stack.Screen
                  name="Settings"
                  component={SettingsScreen}
                  options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: "#03174C" },
                    headerTintColor: "white",
                  }}
                />
                {/*@@@@@@@@@@@@@@@@@@@@여기에 추가해야 이동할 수 있다@@@@@@@@@@@@@@@@@@@@*/}
                <Stack.Screen
                  name="DailyDetail"
                  component={DailyDetailScreen}
                  options={{
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="RecordCreate"
                  component={RecordCreateScreen}
                  options={{
                    headerShown: true,
                  }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        </QueryClientProvider>
      </PaperProvider>
    </RecoilRoot>
  );
}

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
