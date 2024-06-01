import { Redirect, Stack } from "expo-router";

import { useSession } from "../ctx";
import { Text } from "react-native-paper";

export default function AppLayout() {
  const { user, isLoading } = useSession();
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (!user) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }
  return <Stack />;
}
