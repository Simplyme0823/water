import { useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";
import ActionButton from "../../components/ActionButton";
import NutritionSummary from "../../components/NutritionSummary";
import Screen from "../../components/Screen";
import { HISTORY_DAYS, NUTRITION_SUMMARY } from "../../data/mock";

export default function MealDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const meal = useMemo(() => {
    const allMeals = HISTORY_DAYS.flatMap((day) => day.meals);
    return allMeals.find((item) => item.id === id) ?? allMeals[0];
  }, [id]);

  return (
    <Screen>
      <View className="gap-6 pb-6 pt-2">
        <View className="rounded-3xl bg-mist p-6">
          <Text className="text-sm text-stone">{meal?.title ?? "餐别"}</Text>
          <Text className="text-lg font-semibold text-ink">{meal?.time ?? "--:--"}</Text>
          <View className="mt-4 h-40 rounded-2xl bg-cream" />
        </View>

        <View className="rounded-2xl bg-card p-4 shadow-sm">
          <Text className="text-sm text-stone">菜品明细</Text>
          <View className="mt-3 gap-2">
            {meal?.items?.map((item) => (
              <Text key={item.name} className="text-sm text-ink">
                {item.name} · {item.portion} · {item.kcal} kcal
              </Text>
            ))}
          </View>
        </View>

        <NutritionSummary title="营养估算" data={NUTRITION_SUMMARY} />

        <View className="rounded-2xl bg-mist p-4">
          <Text className="text-sm text-ink">备注</Text>
          <Text className="text-xs text-stone">晚餐在家做的，口味偏清淡。</Text>
        </View>

        <ActionButton
          label="编辑记录"
          onPress={() => router.push({ pathname: "/record", params: { id } })}
        />
        <ActionButton label="删除记录" tone="secondary" />
      </View>
    </Screen>
  );
}
