import type { Answer } from "@campfire";
import { StatusBar } from "expo-status-bar";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radii, spacing } from "../theme";

/**
 * The reveal — the payoff for answering.
 *
 * Once the gate is passed, everyone's answers appear as a calm vertical feed.
 * Vanity metrics stay deliberately faint: upvote and reply counts show only
 * when they exist, and never as the loudest thing on a card. This is the "see
 * what everyone else said" half of the BeReal loop.
 */
export function RevealFeed({
  dateLabel,
  questionText,
  answerCount,
  answers,
  currentUserId,
  refreshing,
  onRefresh,
  onSignOut,
}: {
  dateLabel: string;
  questionText: string;
  answerCount: number;
  answers: Answer[];
  currentUserId: string;
  refreshing: boolean;
  onRefresh: () => void;
  onSignOut: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <FlatList
      style={styles.list}
      data={answers}
      keyExtractor={(a) => a.id}
      contentContainerStyle={{
        paddingHorizontal: spacing.lg,
        paddingTop: insets.top + spacing.lg,
        paddingBottom: insets.bottom + spacing.xxl,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.muted}
        />
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <StatusBar style="dark" />
          <View style={styles.headerTop}>
            <Text style={styles.wordmark}>The Social Project</Text>
            <Pressable
              onPress={onSignOut}
              accessibilityRole="button"
              accessibilityLabel="Sign out"
              hitSlop={16}
              style={styles.signOutHit}
            >
              <Text style={styles.signOut}>Sign out</Text>
            </Pressable>
          </View>
          <Text style={styles.date}>{dateLabel}</Text>

          <View style={styles.questionPanel}>
            <Text style={styles.kicker}>
              You answered · {answerCount} {answerCount === 1 ? "voice" : "voices"}
            </Text>
            <Text style={styles.question}>{questionText}</Text>
          </View>

          <Text style={styles.sectionLabel}>Around the fire</Text>
        </View>
      }
      renderItem={({ item }) => (
        <AnswerCard answer={item} isMine={item.user_id === currentUserId} />
      )}
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      ListEmptyComponent={
        <Text style={styles.empty}>
          You&rsquo;re the first voice tonight. Others will appear as they answer.
        </Text>
      }
    />
  );
}

function AnswerCard({ answer, isMine }: { answer: Answer; isMine: boolean }) {
  const name = answer.is_anonymous
    ? "Anonymous"
    : answer.display_name ?? "Someone by the fire";

  const meta: string[] = [];
  if (answer.upvote_count > 0) {
    meta.push(`${answer.upvote_count} ↑`);
  }
  if (answer.reply_count > 0) {
    meta.push(`${answer.reply_count} ${answer.reply_count === 1 ? "reply" : "replies"}`);
  }

  return (
    <View style={[styles.card, isMine && styles.cardMine]}>
      <View style={styles.cardTop}>
        <Text style={styles.name}>{name}</Text>
        {isMine && <Text style={styles.youTag}>You</Text>}
        <View style={{ flex: 1 }} />
        <Text style={styles.time}>{formatRelativeTime(answer.created_at)}</Text>
      </View>
      <Text style={styles.answerBody}>{answer.body}</Text>
      {meta.length > 0 && <Text style={styles.meta}>{meta.join("  ·  ")}</Text>}
    </View>
  );
}

/** A light relative timestamp — "just now", "12m", "3h", "2d". */
function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wordmark: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.muted,
  },
  signOutHit: {
    // Vertical padding lifts the effective tap target toward the 44pt minimum.
    paddingVertical: spacing.sm,
  },
  signOut: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: "500",
  },
  date: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: colors.muted,
  },
  questionPanel: {
    marginTop: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.pine,
    padding: spacing.lg,
  },
  kicker: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.sage,
  },
  question: {
    marginTop: spacing.md,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "500",
    color: colors.pineInk,
  },
  sectionLabel: {
    marginTop: spacing.xl,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.muted,
  },
  card: {
    borderRadius: radii.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.hairline,
    padding: spacing.lg,
  },
  cardMine: {
    borderColor: colors.accent,
    backgroundColor: "rgba(29, 92, 60, 0.04)",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
  },
  youTag: {
    marginLeft: spacing.sm,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: colors.accent,
  },
  time: {
    fontSize: 13,
    color: colors.muted,
  },
  answerBody: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.body,
  },
  meta: {
    marginTop: spacing.md,
    fontSize: 13,
    color: colors.muted,
  },
  empty: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    textAlign: "center",
    paddingVertical: spacing.xl,
  },
});
