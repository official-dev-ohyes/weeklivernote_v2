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

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const queryClient = new QueryClient();

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#03174C" },
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
          title: "홈",
        }}
      />
      <BottomTab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-calendar-sharp" color={color} size={size} />
          ),
          title: "캘린더",
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
          title: "마이 페이지",
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
