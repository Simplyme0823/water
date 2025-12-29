import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#5B8C5A",
        tabBarInactiveTintColor: "#6E6E6E",
        tabBarStyle: {
          backgroundColor: "#F8F5F0",
          borderTopColor: "#E9E5DE"
        },
        tabBarLabelStyle: { fontSize: 12 }
      }}
    >
      <Tabs.Screen name="index" options={{ title: "首页" }} />
      <Tabs.Screen name="history" options={{ title: "历史" }} />
      <Tabs.Screen name="settings" options={{ title: "设置" }} />
    </Tabs>
  );
}
