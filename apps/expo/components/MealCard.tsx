import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import type { MealEntry } from "../data/mock";

type MealCardProps = ComponentProps<typeof Pressable> & {
  meal: MealEntry;
};

export default function MealCard({ meal, ...props }: MealCardProps) {
  return (
    <Pressable className="rounded-2xl bg-card p-4 shadow-sm" {...props}>
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="text-base font-semibold text-ink">{meal.title}</Text>
          <Text className="text-xs text-stone">{meal.time}</Text>
        </View>
        <View className="rounded-full bg-mist px-3 py-1">
          <Text className="text-xs text-ink">{meal.kcal} kcal</Text>
        </View>
      </View>
      <View className="mt-3 gap-1">
        {meal.items.map((item) => (
          <Text key={item.name} className="text-sm text-stone">
            {item.name} · {item.portion} · {item.kcal} kcal
          </Text>
        ))}
      </View>
    </Pressable>
  );
}
