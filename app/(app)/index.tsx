import * as React from "react";
import { BottomNavigation } from "react-native-paper";
import Home from "./home";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Settings from "./settings";
import Water from "./water";
import Mood from "./mood";

const Index: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "home", title: "Home", focusedIcon: "home" },
    { key: "mood", title: "Mood", focusedIcon: "emoticon-happy" },
    { key: "water", title: "Water", focusedIcon: "cup-water" },
    { key: "settings", title: "Settings", focusedIcon: "account-settings" },
  ]);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    mood: Mood,
    water: Water,
    settings: Settings,
  });

  return (
    <BottomNavigation
      style={{ flex: 1, paddingTop: insets.top }}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default Index;
