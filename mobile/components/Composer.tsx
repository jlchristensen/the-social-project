import { MAX_ANSWER_LENGTH, MIN_ANSWER_LENGTH, submitAnswer } from "@campfire";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";
import { colors, radii, spacing } from "../theme";

/**
 * Where you write tonight's answer.
 *
 * The submit button unlocks only once the answer clears the same length floor
 * the database enforces (`MIN_ANSWER_LENGTH`), so the counter and the button
 * agree with the constraint instead of the user discovering it on failure.
 * On success the parent reloads the snapshot, which flips the gate open.
 */
export function Composer({
  questionText,
  questionId,
  userId,
  onSubmitted,
  onCancel,
}: {
  questionText: string;
  questionId: string;
  userId: string;
  onSubmitted: () => void;
  onCancel: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedLength = body.trim().length;
  const remaining = MIN_ANSWER_LENGTH - trimmedLength;
  const canSubmit = trimmedLength >= MIN_ANSWER_LENGTH && !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    const result = await submitAnswer(supabase, {
      questionId,
      userId,
      body,
    });

    if (!result.ok) {
      setSubmitting(false);
      setError(result.error);
      return;
    }

    // Leave `submitting` true — the parent reloads the snapshot and then swaps
    // this screen out for the reveal feed, so re-enabling the button in that
    // window would only flicker. (An "already answered" insert also lands here,
    // because that is success as far as the reveal is concerned.)
    onSubmitted();
  }

  function handleCancel() {
    if (submitting) return;
    // A considered answer is the app's one daily moment — don't discard a
    // non-empty draft silently.
    if (body.trim().length > 0) {
      Alert.alert("Discard your answer?", "Your draft won't be saved.", [
        { text: "Keep writing", style: "cancel" },
        { text: "Discard", style: "destructive", onPress: onCancel },
      ]);
      return;
    }
    onCancel();
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="light" />
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + spacing.md },
        ]}
      >
        <Pressable
          onPress={handleCancel}
          hitSlop={10}
          disabled={submitting}
          accessibilityRole="button"
          accessibilityLabel="Cancel"
        >
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Your answer</Text>
        {/* Spacer keeps the title centred against the Cancel button. */}
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.body}>
        <Text style={styles.question}>{questionText}</Text>

        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="Say it honestly…"
          placeholderTextColor={colors.pineMuted}
          multiline
          autoFocus
          maxLength={MAX_ANSWER_LENGTH}
          textAlignVertical="top"
          style={styles.input}
          editable={!submitting}
        />

        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Text style={styles.counter}>
          {remaining > 0
            ? `${remaining} more character${remaining === 1 ? "" : "s"} to go`
            : "Ready when you are"}
        </Text>
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          accessibilityRole="button"
          accessibilityLabel="Share your answer with the circle"
          accessibilityState={{ disabled: !canSubmit, busy: submitting }}
          style={({ pressed }) => [
            styles.cta,
            !canSubmit && styles.ctaDisabled,
            pressed && canSubmit && styles.ctaPressed,
          ]}
        >
          {submitting ? (
            <ActivityIndicator color={colors.emberInk} accessibilityLabel="Sharing your answer" />
          ) : (
            <Text style={[styles.ctaText, !canSubmit && styles.ctaTextDisabled]}>
              Share with the circle
            </Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pineDeep,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  cancel: {
    fontSize: 15,
    color: colors.sage,
    fontWeight: "500",
    width: 64,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.pineInk,
  },
  headerSpacer: {
    width: 64,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  question: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "500",
    color: colors.pineInk,
    marginBottom: spacing.lg,
  },
  input: {
    flex: 1,
    fontSize: 18,
    lineHeight: 26,
    color: colors.pineInk,
  },
  error: {
    marginTop: spacing.md,
    color: "#f2b8ac",
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.pineHairline,
  },
  counter: {
    fontSize: 13,
    color: colors.pineMuted,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  cta: {
    borderRadius: radii.pill,
    backgroundColor: colors.ember,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  ctaDisabled: {
    backgroundColor: "rgba(232, 162, 76, 0.35)",
  },
  ctaPressed: {
    opacity: 0.85,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.emberInk,
  },
  // On the dim disabled fill, the dark ember-ink label is illegible — switch to
  // a light label so the button text stays readable while still reading as off.
  ctaTextDisabled: {
    color: "rgba(244, 242, 234, 0.55)",
  },
});
