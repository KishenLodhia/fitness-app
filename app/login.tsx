// login.tsx
import React, { useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, Surface } from "react-native-paper";
import { AuthContext } from "./AuthContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { login } = authContext;

  const handleLogin = async () => {
    // Replace with your actual login logic and JWT token retrieval
    const token = "dummy-jwt-token";
    await login(token);
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        <Text style={styles.title}>Login</Text>
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
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
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
  },
  button: {
    marginTop: 16,
  },
});

export default Login;
