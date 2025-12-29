import { Text, View } from "react-native";

type ChatBubbleProps = {
  role: "assistant" | "user";
  text: string;
};

export default function ChatBubble({ role, text }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <View className={`flex-row ${isUser ? "justify-end" : "justify-start"}`}>
      <View
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser ? "bg-sage" : "bg-mist"
        }`}
      >
        <Text className={`${isUser ? "text-white" : "text-ink"} text-sm`}>{text}</Text>
      </View>
    </View>
  );
}
