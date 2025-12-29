import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import ActionButton from "../../components/ActionButton";
import MealCard from "../../components/MealCard";
import NutritionSummary from "../../components/NutritionSummary";
import Screen from "../../components/Screen";
import SectionHeader from "../../components/SectionHeader";
import { NUTRITION_SUMMARY, TODAY_MEALS } from "../../data/mock";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View className="gap-6 pb-4 pt-2">
        <View className="gap-1">
          <Text
            className="text-2xl font-semibold text-ink"
            style={{ fontFamily: "NotoSerifSC" }}
          >
            今天
          </Text>
          <Text className="text-sm text-stone">记录三餐，留住饮食节奏</Text>
        </View>

        <ActionButton label="开始记录" onPress={() => router.push("/record")} />

        <NutritionSummary title="今日营养概览" data={NUTRITION_SUMMARY} />

        <View className="gap-3">
          <SectionHeader
            title="今日三餐"
            action={
              <Pressable
                onPress={() => router.push("/history")}
                className="rounded-full bg-mist px-3 py-1"
              >
                <Text className="text-xs text-ink">查看历史</Text>
              </Pressable>
            }
          />
          <View className="gap-3">
            {TODAY_MEALS.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onPress={() =>
                  router.push({ pathname: "/meal/[id]", params: { id: meal.id } })
                }
              />
            ))}
          </View>
        </View>
      </View>
    </Screen>
  );
}
