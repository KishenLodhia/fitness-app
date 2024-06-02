import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import axios from "axios";
import { Link, router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const toast = useToast();

  const handleRegister = async () => {
    try {
      const response = await axios.post(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/register`, {
        email,
        password,
      });

      if (response.status === 201) {
        toast.show("Registration successful!", {
          type: "success",
        });
        router.replace("/");
      } else {
        throw new Error("Failed to register");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.show("Registration failed. Please try again.", {
        type: "error",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/kishen-8.png")} style={styles.image} />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />
      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Register
      </Button>
      <Link href="/sign-in">
        <Button mode="text" style={styles.button}>
          Login
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
  },
});

export default Register;
