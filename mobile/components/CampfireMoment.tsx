import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radii, spacing } from "../theme";

/**
 * The locked moment — the BeReal beat.
 *
 * One question, full-screen and full-contrast, with a single thing to do:
 * answer. Nobody else's words are on this screen, because the gate hasn't been
 * passed yet. The count is the only social signal, and it's deliberately quiet.
 */
export function CampfireMoment({
  dateLabel,
  questionText,
  answerCount,
  onAnswer,
}: {
  dateLabel: string;
  questionText: string;
  answerCount: number;
  onAnswer: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + spacing.lg,
          paddingBottom: insets.bottom + spacing.xl,
        },
      ]}
    >
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.wordmark}>The Social Project</Text>
        <Text style={styles.date}>{dateLabel}</Text>
      </View>

      <View style={styles.center}>
        <Text style={styles.kicker}>
          The fire is lit · {answerCount} {answerCount === 1 ? "voice" : "voices"}
        </Text>
        <Text style={styles.question}>{questionText}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.hint}>
          Answer honestly to see what everyone else said.
        </Text>
        <Pressable
          onPress={onAnswer}
          accessibilityRole="button"
          accessibilityLabel="Answer to unlock tonight's answers"
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        >
          <Text style={styles.ctaText}>Answer to unlock</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pineDeep,
    paddingHorizontal: spacing.lg,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
  },
  wordmark: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.sage,
  },
  date: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: colors.pineMuted,
  },
  center: {
    flex: 1,
    justifyContent: "center",
  },
  kicker: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.sage,
    textAlign: "center",
  },
  question: {
    marginTop: spacing.lg,
    fontSize: 32,
    lineHeight: 42,
    fontWeight: "500",
    color: colors.pineInk,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
  },
  hint: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.pineMuted,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  cta: {
    alignSelf: "stretch",
    borderRadius: radii.pill,
    backgroundColor: colors.ember,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  ctaPressed: {
    opacity: 0.85,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.emberInk,
  },
});
