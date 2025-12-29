import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#F8F5F0" },
          headerShadowVisible: false,
          headerTitleStyle: { color: "#2E2E2E", fontSize: 18 },
          headerTintColor: "#2E2E2E",
          contentStyle: { backgroundColor: "#F8F5F0" }
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="record"
          options={{ title: "记录", presentation: "modal" }}
        />
        <Stack.Screen name="meal/[id]" options={{ title: "记录详情" }} />
      </Stack>
    </>
  );
}
