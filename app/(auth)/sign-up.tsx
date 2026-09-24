import { useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { posthog } from "@/lib/posthog";
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

  if (code.includes("identifier_exists") || message.includes("already") || message.includes("exists")) {
    return "An account with this email already exists.";
  }
  if (code.includes("password") || message.includes("password")) {
    return "Choose a stronger password and try again.";
  }
  if (code.includes("verification") || message.includes("verification") || message.includes("code")) {
    return "That verification code is invalid. Check your email and try again.";
  }
  if (message.includes("email")) return "Enter a valid email address.";
  if (message.includes("network") || message.includes("fetch")) {
    return "We could not connect. Check your internet and try again.";
  }
  return "We could not create your account. Check your details and try again.";
};

export default function SignUp() {
  const { signUp } = useSignUp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setError("");
    if (!needsVerification && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (needsVerification) {
        const result = await signUp.verifications.verifyEmailCode({
          code: verificationCode.trim(),
        });
        if (result.error) throw result.error;

        if (signUp.status === "complete") {
          const finalizeResult = await signUp.finalize();
          if (finalizeResult.error) throw finalizeResult.error;
          posthog?.capture("user_signed_up");
          router.replace("/(tab)");
        } else {
          setError("That code is not valid yet. Check your email and try again.");
        }
      } else {
        const createResult = await signUp.create({
          emailAddress: email.trim(),
          password,
        });
        if (createResult.error) throw createResult.error;
        const verificationResult = await signUp.verifications.sendEmailCode();
        if (verificationResult.error) throw verificationResult.error;
        setNeedsVerification(true);
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
          <Text className="auth-title">
            {needsVerification ? "Check your email" : "Create your account"}
          </Text>
          <Text className="auth-subtitle">
            {needsVerification
              ? `Enter the verification code sent to ${email}.`
              : "Start seeing every recurring payment in one calm view."}
          </Text>
        </View>

        <View className="auth-card">
          <View className="auth-form">
            {!needsVerification ? (
              <>
                <View className="auth-field">
                  <Text className="auth-label">Email</Text>
                  <TextInput
                    className="auth-input"
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
                    placeholder="Create a password"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="new-password"
                    textContentType="newPassword"
                  />
                </View>
                <View className="auth-field">
                  <Text className="auth-label">Confirm password</Text>
                  <TextInput
                    className="auth-input"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Repeat your password"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="new-password"
                    textContentType="newPassword"
                  />
                </View>
              </>
            ) : (
              <View className="auth-field">
                <Text className="auth-label">Verification code</Text>
                <TextInput
                  className="auth-input"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  placeholder="Enter 6-digit code"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  autoComplete="one-time-code"
                  textContentType="oneTimeCode"
                />
              </View>
            )}

            {!!error && <Text className="auth-error">{error}</Text>}

            <Pressable
              className={`auth-button ${isSubmitting ? "auth-button-disabled" : ""}`}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text className="auth-button-text">
                {isSubmitting
                  ? needsVerification
                    ? "Verifying..."
                    : "Creating account..."
                  : needsVerification
                    ? "Verify email"
                    : "Create account"}
              </Text>
            </Pressable>

            {needsVerification && (
              <Pressable
                className="auth-secondary-button"
                onPress={() => {
                  setNeedsVerification(false);
                  setVerificationCode("");
                  setError("");
                }}
              >
                <Text className="auth-secondary-button-text">Use a different email</Text>
              </Pressable>
            )}
          </View>
        </View>

        <View className="auth-link-row">
          <Text className="auth-link-copy">Already have an account?</Text>
          <Link href="/(auth)/sign-in" className="auth-link">
            Sign in
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
