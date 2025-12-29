import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import ActionButton from "../components/ActionButton";
import ChatBubble from "../components/ChatBubble";
import NutritionSummary from "../components/NutritionSummary";
import Screen from "../components/Screen";
import { NUTRITION_SUMMARY, RECOGNIZED_ITEMS } from "../data/mock";

const steps = ["拍照", "识别", "确认", "营养"];
const mealOptions = ["早餐", "午餐", "晚餐", "加餐"];

export default function RecordScreen() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [mealType, setMealType] = useState("午餐");

  const stepLabel = steps[stepIndex];
  const canAdvance = stepIndex < steps.length - 1;

  const primaryLabel = useMemo(() => {
    if (stepIndex === 0) return "开始识别";
    if (stepIndex === 1) return "进入确认";
    if (stepIndex === 2) return "生成营养分析";
    return "保存记录";
  }, [stepIndex]);

  const handlePrimary = () => {
    if (canAdvance) {
      setStepIndex((value) => Math.min(value + 1, steps.length - 1));
      return;
    }
    router.back();
  };

  return (
    <Screen>
      <View className="gap-6 pb-6 pt-2">
        <View className="flex-row items-center justify-between">
          {steps.map((step, index) => (
            <View key={step} className="items-center">
              <View
                className={`h-2 w-12 rounded-full ${
                  index <= stepIndex ? "bg-sage" : "bg-mist"
                }`}
              />
              <Text className="mt-2 text-xs text-stone">{step}</Text>
            </View>
          ))}
        </View>

        <View className="rounded-2xl bg-card p-4 shadow-sm">
          <Text className="text-sm text-stone">当前步骤</Text>
          <Text className="text-lg font-semibold text-ink">{stepLabel}</Text>
        </View>

        {stepIndex === 0 && (
          <View className="gap-4">
            <View className="h-56 items-center justify-center rounded-3xl bg-mist">
              <Text className="text-sm text-stone">图片预览区</Text>
            </View>
            <View className="flex-row gap-3">
              <ActionButton label="拍照" tone="secondary" />
              <ActionButton label="相册" tone="secondary" />
            </View>
          </View>
        )}

        {stepIndex === 1 && (
          <View className="gap-4">
            <View className="rounded-2xl bg-mist p-4">
              <Text className="text-sm text-ink">@tansui/core 识别中...</Text>
              <Text className="text-xs text-stone">预计 3-8 秒</Text>
            </View>
            <ChatBubble
              role="assistant"
              text="我已识别到 3 道菜，准备进入确认。"
            />
          </View>
        )}

        {stepIndex === 2 && (
          <View className="gap-4">
            <View className="gap-2">
              <Text className="text-sm text-stone">餐别</Text>
              <View className="flex-row flex-wrap gap-2">
                {mealOptions.map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => setMealType(option)}
                    className={`rounded-full px-3 py-1 ${
                      mealType === option ? "bg-sage" : "bg-mist"
                    }`}
                  >
                    <Text
                      className={`text-xs ${mealType === option ? "text-white" : "text-ink"}`}
                    >
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View className="rounded-2xl bg-card p-4 shadow-sm">
              <Text className="text-sm text-stone">识别结果（可编辑）</Text>
              <View className="mt-3 gap-2">
                {RECOGNIZED_ITEMS.map((item) => (
                  <Text key={item.name} className="text-sm text-ink">
                    {item.name} · {item.portion} · {item.kcal} kcal
                  </Text>
                ))}
              </View>
            </View>
            <View className="gap-2">
              <ChatBubble
                role="assistant"
                text="请确认菜品与分量，必要时可以修改。"
              />
              <ChatBubble role="user" text="西兰花少一点，米饭 1/2 碗。" />
            </View>
          </View>
        )}

        {stepIndex === 3 && (
          <View className="gap-4">
            <NutritionSummary title="本餐营养估算" data={NUTRITION_SUMMARY} />
            <View className="rounded-2xl bg-mist p-4">
              <Text className="text-sm text-ink">建议</Text>
              <Text className="text-xs text-stone">
                本餐蛋白质充足，注意控制钠摄入，搭配一份水果更均衡。
              </Text>
            </View>
          </View>
        )}

        <ActionButton label={primaryLabel} onPress={handlePrimary} />
        <ActionButton
          label="取消"
          tone="ghost"
          onPress={() => router.back()}
        />
      </View>
    </Screen>
  );
}
