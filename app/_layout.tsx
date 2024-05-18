import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./AuthContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PaperProvider>
          <Stack>
            <Stack.Screen name="index" />
          </Stack>
        </PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
