import "@/global.css";

import { Text } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-6xl font-sans-extrabold">
       Home
      </Text>

      {/* Onboarding */}
      <Link
        href="/onboarding"
        className="mt-4 font-sans-extrabold rounded bg-primary p-4 text-white"
      >
        Go to Onboarding
      </Link>

      {/* Sign In */}
      <Link
        href="/(auth)/sign-in"
        className="mt-4 font-sans-extrabold rounded bg-primary p-4 text-white"
      >
        Go to Sign In
      </Link>

      {/* Sign Up */}
      <Link
        href="/(auth)/sign-up"
        className="mt-4 font-sans-extrabold rounded bg-primary p-4 text-white"
      >
        Go to Sign Up
      </Link>

     
    </SafeAreaView>
  );
}