import type { ReactNode } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
};

export default function Screen({ children, scroll = true }: ScreenProps) {
  if (scroll) {
    return (
      <SafeAreaView className="flex-1 bg-cream">
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 28 }}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 px-5">{children}</View>
    </SafeAreaView>
  );
}
