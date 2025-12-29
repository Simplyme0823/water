import type { ReactNode } from "react";
import { Text, View } from "react-native";

type SectionHeaderProps = {
  title: string;
  action?: ReactNode;
};

export default function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-lg font-semibold text-ink" style={{ fontFamily: "NotoSerifSC" }}>
        {title}
      </Text>
      {action}
    </View>
  );
}
