import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const getAuthError = (error: unknown) => {
  const clerkError = error as {
    errors?: { code?: string; message?: string }[];
  };
  const details = clerkError.errors?.[0];
  const code = details?.code?.toLowerCase() ?? "";
  const message = details?.message?.toLowerCase() ??
    (error instanceof Error ? error.message.toLowerCase() : "");

  if (code.includes("password_incorrect") || message.includes("password")) {
    return "Incorrect email or password.";
  }
  if (code.includes("identifier_not_found") || message.includes("email") || message.includes("identifier")) {
    return "Enter a valid email address.";
  }
  if (message.includes("network") || message.includes("fetch")) {
    return "We could not connect. Check your internet and try again.";
  }
  return "We could not sign you in. Check your details and try again.";
};

export default function SignIn() {
  const { signIn } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      const result = await signIn.password({
        emailAddress: email.trim(),
        password,
      });
      if (result.error) throw result.error;

      if (signIn.status === "complete") {
        const finalizeResult = await signIn.finalize();
        if (finalizeResult.error) throw finalizeResult.error;
        router.replace("/(tab)");
      } else {
        setError("Additional verification is required for this account.");
      }
    } catch (submitError) {
      setError(getAuthError(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="auth-screen"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="auth-scroll"
        contentContainerClassName="auth-content"
        keyboardShouldPersistTaps="handled"
      >
        <View className="auth-brand-block">
          <View className="auth-logo-wrap">
            <View className="auth-logo-mark">
              <Text className="auth-logo-mark-text">S</Text>
            </View>
            <View>
              <Text className="auth-wordmark">SubTrack</Text>
              <Text className="auth-wordmark-sub">Your subscriptions, clear.</Text>
            </View>
          </View>
          <Text className="auth-title">Welcome back</Text>
          <Text className="auth-subtitle">Sign in to keep your recurring spending in view.</Text>
        </View>

        <View className="auth-card">
          <View className="auth-form">
            <View className="auth-field">
              <Text className="auth-label">Email</Text>
              <TextInput
                className={`auth-input ${error && !email.trim() ? "auth-input-error" : ""}`}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
              />
            </View>

            <View className="auth-field">
              <Text className="auth-label">Password</Text>
              <TextInput
                className="auth-input"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
              />
            </View>

            {!!error && <Text className="auth-error">{error}</Text>}

            <Pressable
              className={`auth-button ${isSubmitting ? "auth-button-disabled" : ""}`}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text className="auth-button-text">
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="auth-link-row">
          <Text className="auth-link-copy">New to SubTrack?</Text>
          <Link href="/(auth)/sign-up" className="auth-link">
            Create an account
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
