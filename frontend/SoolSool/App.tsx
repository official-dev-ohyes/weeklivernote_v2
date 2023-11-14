import "expo-dev-client";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { RootSiblingParent } from "react-native-root-siblings";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LoginScreen from "./screens/LoginScreen";
import KakaoLoginScreen from "./screens/KakaoLoginScreen";
import AddInfoScreen from "./screens/AddInfoScreen";

import HomeScreen from "./screens/HomeScreen";

import CalendarScreen from "./screens/CalendarScreen";
import DailyDetailScreen from "./screens/DailyDetailScreen";
import RecordCreateScreen from "./screens/RecordCreateScreen";

import MyPageScreen from "./screens/MyPageScreen";
import SettingsScreen from "./screens/SettingsScreen";
import NotificationScreen from "./screens/NotificationScreen";
import EditProfileScreen from "./screens/EditProfileScreen";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const queryClient = new QueryClient();

import { Subscription } from "expo-modules-core";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "./utils/notificationUtils";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

import HomeRouteScreen from "./screens/HomeRouteScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LastChanceScreen from "./screens/LastChanceScreen";
import WelcomeScreen from "./screens/WelcomeScreen";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

preventAutoHideAsync();

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: "#363C4B" },
        headerTintColor: "white",
        headerTitleAlign: "center",
        tabBarShowLabel: false,
        tabBarInactiveTintColor: "#ffffff",
        tabBarActiveTintColor: "#FFDE68",
        tabBarStyle: { backgroundColor: "#000000", height: 60 },
      }}
      sceneContainerStyle={{
        backgroundColor: "#ffffff",
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
      <BottomTab.Screen
        name="lastChance"
        component={LastChanceScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" color={color} size={size} />
          ),
          title: "lastChance",
        }}
      />
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

  custom: "property",

  colors: {
    ...DefaultTheme.colors,
    mainPink: "#F2A7C3",
    mainBlue: "#363C4B",
    mainGreen: "#03A678",
    mainYellow: "#F2D06B",
    mainRed: "#F25E5E",
  },
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    "Yeongdeok-Sea": require("./assets/fonts/Yeongdeok-Sea.ttf"),
    LineRegular: require("./assets/fonts/LINESeedKR-Rg.ttf"),
    LineBold: require("./assets/fonts/LINESeedKR-Bd.ttf"),
    LineThin: require("./assets/fonts/LINESeedKR-Th.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // if (!fontsLoaded && !fontError) {
  //   return null;
  // }
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(async (token) => {
      if (token) {
        await AsyncStorage.setItem("expoPushToken", token);
      } else {
        return;
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // console.log("App.tsx 174: ", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      if (
        typeof notificationListener.current !== "undefined" &&
        typeof responseListener.current !== "undefined"
      ) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RecoilRoot>
        <SafeAreaProvider>
          <RootSiblingParent>
            <PaperProvider theme={theme}>
              <QueryClientProvider client={queryClient}>
                <SafeAreaView
                  style={styles.rootScreen}
                  onLayout={onLayoutRootView}
                >
                  <StatusBar style="auto" />
                  <NavigationContainer>
                    <Stack.Navigator
                      screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: "#fff" },
                      }}
                      initialRouteName="BottomTab"
                    >
                      <Stack.Screen name="Login" component={LoginScreen} />
                      <Stack.Screen
                        name="KakaoLoginScreen"
                        component={KakaoLoginScreen}
                      />

                      <Stack.Screen name="AddInfo" component={AddInfoScreen} />
                      <Stack.Screen
                        name="BottomTab"
                        component={BottomTabNavigator}
                      />
                      <Stack.Screen
                        name="Settings"
                        component={SettingsScreen}
                        options={{
                          headerShown: true,
                          headerStyle: { backgroundColor: "#363C4B" },
                          headerTintColor: "white",
                          headerTitleAlign: "center",
                        }}
                      />
                      <Stack.Screen
                        name="EditProfile"
                        component={EditProfileScreen}
                        options={{
                          headerShown: true,
                          headerStyle: { backgroundColor: "#363C4B" },
                          headerTintColor: "white",
                          headerTitleAlign: "center",
                        }}
                      />
                      <Stack.Screen
                        name="Notification"
                        component={NotificationScreen}
                        options={{
                          headerShown: true,
                          headerStyle: { backgroundColor: "#363C4B" },
                          headerTintColor: "white",
                          headerTitleAlign: "center",
                        }}
                      />
                      <Stack.Screen
                        name="DailyDetail"
                        component={DailyDetailScreen}
                        options={{
                          headerShown: true,
                          headerStyle: { backgroundColor: "#363C4B" },
                          headerTintColor: "white",
                          title: "Calendar",
                        }}
                      />
                      <Stack.Screen
                        name="RecordCreate"
                        component={RecordCreateScreen}
                        options={{
                          headerShown: true,
                          headerStyle: { backgroundColor: "#363C4B" },
                          headerTintColor: "white",
                          title: "Calendar",
                        }}
                      />
                      <Stack.Screen
                        name="HomeRoute"
                        component={HomeRouteScreen}
                        options={{
                          headerShown: false,
                          headerStyle: { backgroundColor: "#363C4B" },
                          headerTintColor: "white",
                          title: "HomeRoute",
                        }}
                      />
                      <Stack.Screen
                        name="Welcome"
                        component={WelcomeScreen}
                        options={{
                          headerShown: false,
                          headerStyle: { backgroundColor: "#363C4B" },
                          headerTintColor: "white",
                          title: "Welcome",
                        }}
                      />
                    </Stack.Navigator>
                  </NavigationContainer>
                </SafeAreaView>
              </QueryClientProvider>
            </PaperProvider>
          </RootSiblingParent>
        </SafeAreaProvider>
      </RecoilRoot>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
  },
});
