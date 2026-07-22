import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../lib/auth";
import { colors } from "../theme";

/**
 * Root layout. Expo Router works like the website's `app/` folder: files under
 * `app/` become screens, and this file wraps all of them.
 *
 * `AuthProvider` sits above the navigator so every screen can read the session.
 * The screens themselves decide where a signed-out visitor goes, keeping each
 * redirect next to the data that triggers it.
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
          }}
        />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
