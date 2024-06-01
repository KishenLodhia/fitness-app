import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import { useSession } from "../ctx";

const Settings = () => {
  const { user, signOut } = useSession();
  const handleLogout = () => {
    signOut();
  };

  return (
    <View>
      <Text>settings</Text>
      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({});
