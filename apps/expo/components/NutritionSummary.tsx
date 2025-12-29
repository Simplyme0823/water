import { Text, View } from "react-native";

export type NutritionSummaryData = {
  kcal: number;
  protein_g: number;
  fat_g: number;
  carb_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
};

type NutritionSummaryProps = {
  title?: string;
  data: NutritionSummaryData;
};

const TARGETS = {
  kcal: 2000,
  protein_g: 75,
  fat_g: 70,
  carb_g: 260,
  fiber_g: 25,
  sugar_g: 50,
  sodium_mg: 2000
};

const rows = [
  { key: "kcal", label: "热量", unit: "kcal", color: "bg-apricot" },
  { key: "protein_g", label: "蛋白质", unit: "g", color: "bg-sage" },
  { key: "fat_g", label: "脂肪", unit: "g", color: "bg-sage" },
  { key: "carb_g", label: "碳水", unit: "g", color: "bg-sage" },
  { key: "fiber_g", label: "膳食纤维", unit: "g", color: "bg-mist" },
  { key: "sugar_g", label: "糖", unit: "g", color: "bg-mist" },
  { key: "sodium_mg", label: "钠", unit: "mg", color: "bg-mist" }
] as const;

export default function NutritionSummary({ title, data }: NutritionSummaryProps) {
  return (
    <View className="rounded-2xl bg-card p-4 shadow-sm">
      {title ? (
        <Text className="mb-3 text-base font-semibold text-ink" style={{ fontFamily: "NotoSerifSC" }}>
          {title}
        </Text>
      ) : null}
      <View className="gap-3">
        {rows.map((row) => {
          const value = data[row.key];
          const target = TARGETS[row.key];
          const ratio = Math.min(value / target, 1);

          return (
            <View key={row.key}>
              <View className="mb-1 flex-row items-center justify-between">
                <Text className="text-sm text-ink">{row.label}</Text>
                <Text className="text-sm text-stone">
                  {value} {row.unit}
                </Text>
              </View>
              <View className="h-2 w-full overflow-hidden rounded-full bg-mist">
                <View className={`h-2 ${row.color}`} style={{ width: `${ratio * 100}%` }} />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
