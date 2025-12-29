import { useState } from "react";
import { Switch, Text, TextInput, View } from "react-native";
import ActionButton from "../../components/ActionButton";
import Screen from "../../components/Screen";
import SectionHeader from "../../components/SectionHeader";

export default function SettingsScreen() {
  const [model, setModel] = useState("tansui-cloud-default");
  const [apiKey, setApiKey] = useState("");
  const [allowAnalytics, setAllowAnalytics] = useState(true);

  return (
    <Screen>
      <View className="gap-6 pb-4 pt-2">
        <SectionHeader title="设置" />

        <View className="gap-3 rounded-2xl bg-card p-4 shadow-sm">
          <Text className="text-sm text-stone">模型</Text>
          <TextInput
            value={model}
            onChangeText={setModel}
            placeholder="输入模型名称"
            className="rounded-xl bg-mist px-3 py-2 text-sm text-ink"
            placeholderTextColor="#6E6E6E"
          />
          <Text className="text-sm text-stone">API Key</Text>
          <TextInput
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="sk-..."
            secureTextEntry
            className="rounded-xl bg-mist px-3 py-2 text-sm text-ink"
            placeholderTextColor="#6E6E6E"
          />
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-ink">允许匿名使用数据（仅统计）</Text>
            <Switch value={allowAnalytics} onValueChange={setAllowAnalytics} />
          </View>
        </View>

        <ActionButton label="保存配置" />
        <ActionButton label="清空本地数据" tone="secondary" />
      </View>
    </Screen>
  );
}
