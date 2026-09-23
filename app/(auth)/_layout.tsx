import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import "@/global.css";

export default function RootLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (isLoaded && isSignedIn) {
    return <Redirect href="/(tab)" />;
  }

  return <Stack initialRouteName="sign-in" screenOptions={{ headerShown: false }} />;
}
