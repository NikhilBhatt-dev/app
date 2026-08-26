import "@/global.css";
import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="text-2xl font-bold text-primary">
        Welcome to NativeWind!
      </Text>

      {/* Onboarding */}
      <Link
        href="/onboarding"
        className="mt-4 rounded-lg bg-black px-6 py-4 text-white"
      >
        Go to Onboarding
      </Link>

      {/* Sign In */}
      <Link
        href="/(auth)/sign-in"
        className="mt-4 rounded-lg bg-black px-6 py-4 text-white"
      >
        Go to Sign In
      </Link>

      {/* Sign Up */}
      <Link
        href="/(auth)/sign-up"
        className="mt-4 rounded-lg bg-black px-6 py-4 text-white"
      >
        Go to Sign Up
      </Link>

      {/* Spotify Subscription */}
      <Link
        href={{
          pathname: "/(tab)/subscriptions/[id]",
          params: { id: "spotify" },
        }}
        className="mt-4 rounded-lg bg-black px-6 py-4 text-white"
      >
        Spotify Subscription
      </Link>

      {/* Claude Subscription */}
      <Link
        href={{
          pathname: "/(tab)/subscriptions/[id]",
          params: { id: "claude" },
        }}
        className="mt-4 rounded-lg bg-black px-6 py-4 text-white"
      >
        Claude Max Subscription
      </Link>
    </View>
  );
}