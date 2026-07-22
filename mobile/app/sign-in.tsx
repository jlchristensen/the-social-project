import { Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { colors, radii, spacing } from "../theme";

/**
 * Sign in / sign up / reset — the door to the campfire.
 *
 * Email + password, the same method the website uses, so an account works on
 * both surfaces. When auth succeeds the session updates and this screen
 * redirects itself to the campfire; the redirect lives here rather than in a
 * callback so it fires no matter how the session arrives.
 *
 * Password reset uses a 6-digit CODE, not an email link. A link has to redirect
 * somewhere reachable (which breaks across localhost / phone / native), whereas
 * a code the user types works everywhere with no redirect at all: we email the
 * code, verify it with `verifyOtp(type: "recovery")`, then set the new password.
 */

type Mode = "signIn" | "signUp" | "resetRequest" | "resetVerify";

const COPY: Record<Mode, { h: string; s: string; cta: string }> = {
  signIn: {
    h: "Welcome back",
    s: "Sign in to gather round tonight's fire.",
    cta: "Sign in",
  },
  signUp: {
    h: "Pull up a seat",
    s: "One question a night. Answer honestly to see everyone else.",
    cta: "Create account",
  },
  resetRequest: {
    h: "Reset your password",
    s: "Enter your email and we'll send you a 6-digit code.",
    cta: "Send reset code",
  },
  resetVerify: {
    h: "Enter your code",
    s: "Check your email for the 6-digit code, then choose a new password.",
    cta: "Set new password",
  },
};

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [mode, setMode] = useState<Mode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Already signed in → straight to the campfire.
  if (user) return <Redirect href="/" />;

  const isSignUp = mode === "signUp";
  const isResetRequest = mode === "resetRequest";
  const isResetVerify = mode === "resetVerify";
  const copy = COPY[mode];

  function goTo(next: Mode) {
    setMode(next);
    setError(null);
    setNotice(null);
  }

  async function submit() {
    setError(null);
    setNotice(null);

    // Reset, step 1 — email a 6-digit recovery code.
    if (isResetRequest) {
      if (!email.trim()) {
        setError("Enter your email.");
        return;
      }
      setLoading(true);
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim()
      );
      setLoading(false);
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setNotice(`We emailed a 6-digit code to ${email.trim()}.`);
      setCode("");
      setPassword("");
      setMode("resetVerify");
      return;
    }

    // Reset, step 2 — verify the code, then set the new password.
    if (isResetVerify) {
      if (!code.trim() || !password) {
        setError("Enter the code and a new password.");
        return;
      }
      if (password.length < 6) {
        setError("Use a password of at least 6 characters.");
        return;
      }
      setLoading(true);
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code.trim(),
        type: "recovery",
      });
      if (verifyError) {
        setLoading(false);
        setError(verifyError.message);
        return;
      }
      // The code was valid — we now have a session, so we can set the password.
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });
      setLoading(false);
      if (updateError) {
        setError(updateError.message);
        return;
      }
      // Session is active → the redirect at the top of this screen fires.
      return;
    }

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    setLoading(true);

    if (isSignUp) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      setLoading(false);
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      // No session back means the project requires email confirmation first.
      if (!data.session) {
        setNotice(
          "Check your email to confirm your account, then come back and sign in."
        );
        setMode("signIn");
      }
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
    }
    // On success the auth listener flips `user`, and the redirect above fires.
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + spacing.xxl,
            paddingBottom: insets.bottom + spacing.xl,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.wordmark}>The Social Project</Text>
        <Text style={styles.heading}>{copy.h}</Text>
        <Text style={styles.sub}>{copy.s}</Text>

        <View style={styles.form}>
          {isResetVerify ? (
            <Text style={styles.resetting}>Resetting {email.trim()}</Text>
          ) : (
            <>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.pineMuted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                style={styles.input}
                onSubmitEditing={isResetRequest ? submit : undefined}
                returnKeyType={isResetRequest ? "go" : "next"}
              />
            </>
          )}

          {isResetVerify && (
            <>
              <Text style={styles.label}>6-digit code</Text>
              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="123456"
                placeholderTextColor={colors.pineMuted}
                keyboardType="number-pad"
                autoComplete="one-time-code"
                textContentType="oneTimeCode"
                maxLength={6}
                style={[styles.input, styles.codeInput]}
              />
            </>
          )}

          {!isResetRequest && (
            <>
              <Text style={[styles.label, { marginTop: spacing.md }]}>
                {isResetVerify ? "New password" : "Password"}
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={isResetVerify ? "Choose a new password" : "Your password"}
                placeholderTextColor={colors.pineMuted}
                secureTextEntry
                autoCapitalize="none"
                textContentType={
                  isSignUp || isResetVerify ? "newPassword" : "password"
                }
                style={styles.input}
                onSubmitEditing={submit}
                returnKeyType="go"
              />
            </>
          )}

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          {notice && (
            <View style={styles.noticeBox}>
              <Text style={styles.noticeText}>{notice}</Text>
            </View>
          )}

          <Pressable
            onPress={submit}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={copy.cta}
            accessibilityState={{ busy: loading, disabled: loading }}
            style={({ pressed }) => [
              styles.cta,
              (pressed || loading) && styles.ctaPressed,
            ]}
          >
            {loading ? (
              <ActivityIndicator color={colors.emberInk} />
            ) : (
              <Text style={styles.ctaText}>{copy.cta}</Text>
            )}
          </Pressable>

          <View style={styles.links}>
            {mode === "signIn" && (
              <>
                <Pressable
                  onPress={() => goTo("resetRequest")}
                  accessibilityRole="button"
                  accessibilityLabel="Forgot password"
                  hitSlop={8}
                >
                  <Text style={styles.toggleText}>Forgot password?</Text>
                </Pressable>
                <Pressable
                  onPress={() => goTo("signUp")}
                  accessibilityRole="button"
                  accessibilityLabel="Create an account"
                  hitSlop={8}
                >
                  <Text style={styles.toggleText}>New here? Create an account</Text>
                </Pressable>
              </>
            )}
            {mode === "signUp" && (
              <Pressable
                onPress={() => goTo("signIn")}
                accessibilityRole="button"
                accessibilityLabel="Switch to sign in"
                hitSlop={8}
              >
                <Text style={styles.toggleText}>Already have an account? Sign in</Text>
              </Pressable>
            )}
            {isResetVerify && (
              <Pressable
                onPress={() => goTo("resetRequest")}
                accessibilityRole="button"
                accessibilityLabel="Send a new code"
                hitSlop={8}
              >
                <Text style={styles.toggleText}>Didn&rsquo;t get it? Send a new code</Text>
              </Pressable>
            )}
            {(isResetRequest || isResetVerify) && (
              <Pressable
                onPress={() => goTo("signIn")}
                accessibilityRole="button"
                accessibilityLabel="Back to sign in"
                hitSlop={8}
              >
                <Text style={styles.toggleText}>Back to sign in</Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.pineDeep,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
  },
  wordmark: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.sage,
  },
  heading: {
    marginTop: spacing.md,
    fontSize: 34,
    fontWeight: "600",
    color: colors.pineInk,
  },
  sub: {
    marginTop: spacing.sm,
    fontSize: 15,
    lineHeight: 22,
    color: colors.pineMuted,
  },
  form: {
    marginTop: spacing.xl,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: colors.sage,
    marginBottom: spacing.xs,
  },
  input: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.pineHairline,
    backgroundColor: "rgba(244, 242, 234, 0.06)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.pineInk,
  },
  errorBox: {
    marginTop: spacing.md,
    borderRadius: radii.md,
    backgroundColor: "rgba(220, 90, 70, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(220, 90, 70, 0.35)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  errorText: {
    color: "#f2b8ac",
    fontSize: 14,
  },
  noticeBox: {
    marginTop: spacing.md,
    borderRadius: radii.md,
    backgroundColor: "rgba(159, 196, 172, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(159, 196, 172, 0.35)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  noticeText: {
    color: colors.sage,
    fontSize: 14,
    lineHeight: 20,
  },
  cta: {
    marginTop: spacing.lg,
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
  toggle: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  toggleText: {
    fontSize: 14,
    color: colors.sage,
    fontWeight: "500",
  },
  links: {
    marginTop: spacing.lg,
    alignItems: "center",
    gap: spacing.md,
  },
  resetting: {
    fontSize: 14,
    color: colors.pineMuted,
    marginBottom: spacing.md,
  },
  codeInput: {
    fontSize: 22,
    letterSpacing: 6,
    fontWeight: "600",
  },
})
