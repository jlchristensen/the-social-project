import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

/**
 * The app's Supabase client.
 *
 * Same project, same tables, same row-level security rules as the website —
 * this is just a different door into it.
 *
 * The shared campfire library takes a client as an argument rather than
 * importing one, which is exactly why it can be shared: the web passes its
 * server client, the app passes this.
 */

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Failing loudly here beats a confusing network error on the first query.
  throw new Error(
    "Missing Supabase credentials. Copy mobile/.env.example to mobile/.env " +
      "and fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Sessions live in AsyncStorage so signing in survives closing the app.
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // URL-based session detection is a browser concept; on native it would
    // try to read a location that doesn't exist.
    detectSessionInUrl: false,
  },
});
