import { useCallback } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { preventAutoHideAsync, hideAsync } from "expo-splash-screen";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LoginScreen from "./screens/LoginScreen";
import KakaoLoginScreen from "./screens/KakaoLoginScreen";
import KakaoRedirectScreen from "./screens/KakaoRedirectScreen";
import AddInfoScreen from "./screens/AddInfoScreen";
import AddInfoStep2Screen from "./screens/AddInfoStep2Screen";
import AddInfoStep3Screen from "./screens/AddInfoStep3Screen";

import HomeScreen from "./screens/HomeScreen";

import CalendarScreen from "./screens/CalendarScreen";
import DailyDetailScreen from "./screens/DailyDetailScreen";
import RecordCreateScreen from "./screens/RecordCreateScreen";

// import MapScreen from "./screens/MapScreen";

import MyPageScreen from "./screens/MyPageScreen";
import SettingsScreen from "./screens/SettingsScreen";
import NotificationScreen from "./screens/NotificationScreen";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const queryClient = new QueryClient();

preventAutoHideAsync();

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#0477BF" },
        headerTintColor: "white",
        tabBarShowLabel: false,
      }}
      sceneContainerStyle={{
        backgroundColor: "#fff",
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
          title: "Map",
        }}
      /> */}
      <BottomTab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
          title: "My Page",
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
  const [fontsLoaded, fontError] = useFonts({
    "Yeongdeok-Sea": require("./assets/fonts/Yeongdeok-Sea.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <RecoilRoot>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <SafeAreaView style={styles.rootScreen} onLayout={onLayoutRootView}>
              <StatusBar style="auto" />
              <NavigationContainer>
                <Stack.Navigator
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "#fff" },
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
                  <Stack.Screen
                    name="BottomTab"
                    component={BottomTabNavigator}
                  />
                  <Stack.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                      headerShown: true,
                      headerStyle: { backgroundColor: "#0477BF" },
                      headerTintColor: "white",
                    }}
                  />
                  <Stack.Screen
                    name="DailyDetail"
                    component={DailyDetailScreen}
                    options={{
                      headerShown: true,
                      headerStyle: { backgroundColor: "#0477BF" },
                      headerTintColor: "white",
                      title: "Calendar",
                    }}
                  />
                  <Stack.Screen
                    name="RecordCreate"
                    component={RecordCreateScreen}
                    options={{
                      headerShown: true,
                      headerStyle: { backgroundColor: "#0477BF" },
                      headerTintColor: "white",
                      title: "Calendar",
                    }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </SafeAreaView>
          </QueryClientProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </RecoilRoot>
  );
}

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
  },
});
