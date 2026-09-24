import { useClerk } from "@clerk/expo";
import { useState } from "react";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { posthog } from "@/lib/posthog";

export default function Settings() {
  const { signOut } = useClerk();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
      posthog?.capture("user_signed_out");
      posthog?.logger.info("sign_out_completed");
      posthog?.reset();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="auth-title">Settings</Text>
      <Pressable
        className={`auth-button mt-8 ${isSigningOut ? "auth-button-disabled" : ""}`}
        onPress={handleSignOut}
        disabled={isSigningOut}
      >
        <Text className="auth-button-text">
          {isSigningOut ? "Signing out..." : "Sign out"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}