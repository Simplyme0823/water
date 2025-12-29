import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import MealCard from "../../components/MealCard";
import Screen from "../../components/Screen";
import SectionHeader from "../../components/SectionHeader";
import { HISTORY_DAYS } from "../../data/mock";

export default function HistoryScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View className="gap-6 pb-4 pt-2">
        <SectionHeader title="历史记录" />
        <View className="gap-6">
          {HISTORY_DAYS.map((day) => (
            <View key={day.date} className="gap-3">
              <Text className="text-sm text-stone">{day.date}</Text>
              <View className="gap-3">
                {day.meals.map((meal) => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    onPress={() =>
                      router.push({
                        pathname: "/meal/[id]",
                        params: { id: meal.id }
                      })
                    }
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}
