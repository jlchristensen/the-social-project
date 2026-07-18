import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  formatCampfireDate,
  getCampfireDate,
  getCampfireSnapshot,
  type CampfireSnapshot,
} from "@campfire";
import { supabase } from "../lib/supabase";
import { colors, spacing } from "../theme";

/**
 * The campfire — tonight's question.
 *
 * The data comes from `@campfire`, the same library the website uses, so the
 * app can never show a different question than the web on the same evening.
 */

type ScreenState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; snapshot: CampfireSnapshot };

export default function CampfireScreen() {
  const insets = useSafeAreaInsets();
  const [state, setState] = useState<ScreenState>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);
  const today = getCampfireDate();

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const result = await getCampfireSnapshot(supabase, user?.id ?? null, today);

    if (!result.ok) {
      setState({ status: "error", message: result.error });
      return;
    }
    setState({ status: "ready", snapshot: result.data });
  }, [today]);

  useEffect(() => {
    void load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xxl },
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.muted} />
      }
    >
      <Text style={styles.wordmark}>The Social Project</Text>
      <Text style={styles.date}>{formatCampfireDate(today)}</Text>

      {state.status === "loading" && (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.accent} />
        </View>
      )}

      {state.status === "error" && (
        <View style={styles.panel}>
          <Text style={styles.panelKicker}>Something went wrong</Text>
          <Text style={styles.panelQuestion}>
            We couldn&rsquo;t reach the campfire.
          </Text>
          <Text style={styles.panelBody}>
            Pull down to try again. If it keeps happening, the problem is on our
            end, not yours.
          </Text>
        </View>
      )}

      {state.status === "ready" && <Campfire snapshot={state.snapshot} />}
    </ScrollView>
  );
}

function Campfire({ snapshot }: { snapshot: CampfireSnapshot }) {
  const { question, answerCount, hasAnswered } = snapshot;

  // No question scheduled tonight — a genuine quiet night, not a failure.
  if (!question) {
    return (
      <View style={styles.panel}>
        <Text style={styles.panelKicker}>The fire is quiet tonight</Text>
        <Text style={styles.panelQuestion}>
          Tomorrow&rsquo;s question is being crafted.
        </Text>
        <Text style={styles.panelBody}>
          A new question arrives every day.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.panel}>
      <Text style={styles.panelKicker}>
        The fire is lit · {answerCount} {answerCount === 1 ? "voice" : "voices"}
      </Text>
      <Text style={styles.panelQuestion}>{question.question_text}</Text>
      <Text style={styles.panelBody}>
        {hasAnswered
          ? "You've answered tonight. The circle is open."
          : "Answer honestly to see what everyone else said."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  wordmark: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.muted,
  },
  date: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: colors.muted,
  },
  centered: {
    marginTop: spacing.xxl,
    alignItems: "center",
  },
  panel: {
    marginTop: spacing.xl,
    borderRadius: 20,
    backgroundColor: colors.pine,
    padding: spacing.lg,
  },
  panelKicker: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.sage,
  },
  panelQuestion: {
    marginTop: spacing.md,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "500",
    color: colors.pineInk,
  },
  panelBody: {
    marginTop: spacing.md,
    fontSize: 15,
    lineHeight: 22,
    color: colors.pineMuted,
  },
});
