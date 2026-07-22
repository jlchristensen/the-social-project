import {
  formatCampfireDate,
  getCampfireDate,
  getCampfireSnapshot,
  type CampfireSnapshot,
} from "@campfire";
import { Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CampfireMoment } from "../components/CampfireMoment";
import { Composer } from "../components/Composer";
import { RevealFeed } from "../components/RevealFeed";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { colors, radii, spacing } from "../theme";

/**
 * The campfire — the app's one loop.
 *
 * Signed out, the router sends you to sign-in. Signed in, one question a night
 * runs through three beats: the locked *moment*, the *composer*, and — once
 * you've answered — the *reveal feed*. The gate between "haven't answered" and
 * "have answered" is `snapshot.hasAnswered`, which `getCampfireSnapshot` derives
 * server-side, so the feed can't be reached without actually posting.
 */

type ScreenState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; snapshot: CampfireSnapshot };

export default function CampfireScreen() {
  const { user, loading: authLoading, signOut } = useAuth();
  const today = getCampfireDate();
  const dateLabel = formatCampfireDate(today);

  const [state, setState] = useState<ScreenState>({ status: "loading" });
  const [composerOpen, setComposerOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const userId = user?.id;

  // Keyed on `userId` (a stable string), not the `user` object — otherwise
  // every hourly token refresh mints a new object and needlessly refetches.
  const load = useCallback(async () => {
    if (!userId) return;
    const result = await getCampfireSnapshot(supabase, userId, today);
    if (!result.ok) {
      setState({ status: "error", message: result.error });
      return;
    }
    setState({ status: "ready", snapshot: result.data });
  }, [userId, today]);

  useEffect(() => {
    void load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  // Auth is still resolving from storage — hold on the splash rather than
  // flashing sign-in at someone who is actually signed in.
  if (authLoading) return <Splash />;

  // Signed out → the door.
  if (!user) return <Redirect href="/sign-in" />;

  if (state.status === "loading") return <Splash />;

  if (state.status === "error") {
    return <ErrorScreen message={state.message} onRetry={load} />;
  }

  const { snapshot } = state;

  // A genuinely quiet night — no question scheduled.
  if (!snapshot.question) {
    return <QuietNight dateLabel={dateLabel} onSignOut={signOut} />;
  }

  // Passed the gate — the reveal.
  if (snapshot.hasAnswered) {
    return (
      <RevealFeed
        dateLabel={dateLabel}
        questionText={snapshot.question.question_text}
        answerCount={snapshot.answerCount}
        answers={snapshot.answers}
        currentUserId={user.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onSignOut={signOut}
      />
    );
  }

  // Haven't answered — the composer, or the moment that opens it.
  if (composerOpen) {
    return (
      <Composer
        // Remount if the question changes (e.g. midnight rollover) so a draft
        // typed for one question can never be submitted against another.
        key={snapshot.question.id}
        questionText={snapshot.question.question_text}
        questionId={snapshot.question.id}
        userId={user.id}
        onSubmitted={async () => {
          // Reload first, THEN close — so the screen goes composer → reveal
          // without flashing the locked "Answer to unlock" moment in between.
          await load();
          setComposerOpen(false);
        }}
        onCancel={() => setComposerOpen(false)}
      />
    );
  }

  return (
    <CampfireMoment
      dateLabel={dateLabel}
      questionText={snapshot.question.question_text}
      answerCount={snapshot.answerCount}
      onAnswer={() => setComposerOpen(true)}
    />
  );
}

function Splash() {
  return (
    <View style={styles.splash}>
      <StatusBar style="light" />
      <ActivityIndicator color={colors.sage} accessibilityLabel="Loading" />
    </View>
  );
}

function ErrorScreen({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.centered,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar style="dark" />
      <View style={styles.panel}>
        <Text style={styles.panelKicker}>Something went wrong</Text>
        <Text style={styles.panelBody}>We couldn&rsquo;t reach the campfire.</Text>
        <Text style={styles.panelSub}>{message}</Text>
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Try again"
          style={({ pressed }) => [styles.retry, pressed && styles.retryPressed]}
        >
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    </View>
  );
}

function QuietNight({
  dateLabel,
  onSignOut,
}: {
  dateLabel: string;
  onSignOut: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.centered,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar style="dark" />
      <View style={styles.panel}>
        <Text style={styles.panelKicker}>{dateLabel}</Text>
        <Text style={styles.panelTitle}>The fire is quiet tonight</Text>
        <Text style={styles.panelSub}>
          Tomorrow&rsquo;s question is being crafted. A new one arrives every day.
        </Text>
        <Pressable
          onPress={onSignOut}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          hitSlop={12}
          style={{ marginTop: spacing.lg }}
        >
          <Text style={styles.signOut}>Sign out</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.pineDeep,
    alignItems: "center",
    justifyContent: "center",
  },
  centered: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  panel: {
    width: "100%",
    borderRadius: radii.lg,
    backgroundColor: colors.pine,
    padding: spacing.lg,
    alignItems: "center",
  },
  panelKicker: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.sage,
  },
  panelTitle: {
    marginTop: spacing.md,
    fontSize: 24,
    fontWeight: "500",
    color: colors.pineInk,
    textAlign: "center",
  },
  panelBody: {
    marginTop: spacing.md,
    fontSize: 18,
    color: colors.pineInk,
    textAlign: "center",
  },
  panelSub: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 20,
    color: colors.pineMuted,
    textAlign: "center",
  },
  retry: {
    marginTop: spacing.lg,
    borderRadius: radii.pill,
    backgroundColor: colors.ember,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  retryPressed: {
    opacity: 0.85,
  },
  retryText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.emberInk,
  },
  signOut: {
    fontSize: 14,
    color: colors.sage,
    fontWeight: "500",
  },
});
