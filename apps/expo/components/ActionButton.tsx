import type { ComponentProps } from "react";
import { Pressable, Text } from "react-native";

type ActionButtonProps = ComponentProps<typeof Pressable> & {
  label: string;
  tone?: "primary" | "secondary" | "ghost";
};

export default function ActionButton({ label, tone = "primary", ...props }: ActionButtonProps) {
  const toneClass =
    tone === "primary"
      ? "bg-sage"
      : tone === "secondary"
        ? "bg-mist"
        : "bg-transparent";
  const textClass = tone === "primary" ? "text-white" : "text-ink";

  return (
    <Pressable
      className={`rounded-2xl px-4 py-3 ${toneClass}`}
      accessibilityRole="button"
      {...props}
    >
      <Text className={`text-center text-base font-semibold ${textClass}`}>
        {label}
      </Text>
    </Pressable>
  );
}
