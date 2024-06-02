// login.tsx
import axios from "axios";
import { Link, router } from "expo-router";
import React, { useState, useContext } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";

import { useSession } from "./ctx";

const Login: React.FC = () => {
  const [username, setUsername] = useState("k4@gmail.com");
  const [password, setPassword] = useState("123333");
  const [token, setToken] = useState();
  const [error, setError] = useState();
  const { signIn } = useSession();

  const handleLogin = async () => {
    signIn(username, password);
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/kishen-8.png")} style={styles.image} />

      <TextInput label="Username" value={username} onChangeText={setUsername} style={styles.input} mode="outlined" />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
      <Link href="/register">
        <Button mode="text" style={styles.button}>
          Register
        </Button>
      </Link>

      <Text variant="headlineSmall">{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  surface: {
    padding: 16,
    elevation: 4,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
    width: 300,
  },
  button: {
    marginTop: 16,
    width: 300,
  },
  image: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Login;
