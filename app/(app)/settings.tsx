// Settings.js
import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, ScrollView, Alert, Switch } from "react-native";
import { Text, Card, Avatar, TextInput, Button, Divider } from "react-native-paper";
import axios from "axios";
import { useSession } from "../ctx";
import { useToast } from "react-native-toast-notifications";
import { ThemeContext } from "../ThemeContext"; // Import ThemeContext
import { Link, useNavigation } from "expo-router";

interface UserData {
  id: string;
  email: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  fitness_goal: string;
}

const Settings: React.FC = () => {
  const { user, signOut } = useSession();
  const toast = useToast();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [updatedData, setUpdatedData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.status === 200) {
        const data = response.data[0];
        setUserData(data);
        setUpdatedData(data);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      toast.show("Error fetching user data", { type: "danger" });
    }
  };

  const handleEditPress = () => {
    setIsEditing(true);
    // setUpdatedData({ ...userData });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/${user?.id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status === 200) {
        setUserData(response.data);
        setIsEditing(false);
        toast.show("Profile updated successfully", { type: "success" });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      toast.show("Failed to update profile", { type: "danger" });
    }
  };

  const handleLogout = () => {
    signOut();
  };

  const getInitials = (name: string) => {
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("");
    return initials.toUpperCase();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="displaySmall">Settings</Text>
      {userData && (
        <Card mode="contained" style={styles.card}>
          <View style={styles.profileSection}>
            {userData.name && <Avatar.Text size={64} label={getInitials(userData.name)} />}
            <Text style={styles.name}>{userData.name}</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.infoSection}>
            <TextInput
              label="Email"
              value={updatedData?.email}
              onChangeText={(text) => setUpdatedData((prevData) => (prevData ? { ...prevData, email: text } : null))}
              disabled={!isEditing}
              style={styles.input}
            />
            <TextInput
              label="Name"
              value={updatedData?.name}
              onChangeText={(text) => setUpdatedData((prevData) => (prevData ? { ...prevData, name: text } : null))}
              disabled={!isEditing}
              style={styles.input}
            />
            <TextInput
              label="Age"
              value={updatedData?.age?.toString()}
              onChangeText={(text) =>
                setUpdatedData((prevData) => (prevData ? { ...prevData, age: parseInt(text) } : null))
              }
              disabled={!isEditing}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              label="Height"
              value={updatedData?.height?.toString()}
              onChangeText={(text) =>
                setUpdatedData((prevData) => (prevData ? { ...prevData, height: parseFloat(text) } : null))
              }
              disabled={!isEditing}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              label="Weight"
              value={updatedData?.weight?.toString()}
              onChangeText={(text) =>
                setUpdatedData((prevData) => (prevData ? { ...prevData, weight: parseFloat(text) } : null))
              }
              disabled={!isEditing}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              label="Fitness Goal"
              value={updatedData?.fitness_goal}
              onChangeText={(text) =>
                setUpdatedData((prevData) => (prevData ? { ...prevData, fitness_goal: text } : null))
              }
              disabled={!isEditing}
              style={styles.input}
            />
            {isEditing ? (
              <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
                Save
              </Button>
            ) : (
              <Button mode="text" onPress={handleEdit} style={styles.editButton}>
                Edit
              </Button>
            )}
          </View>
          <Divider style={styles.divider} />
          <View style={styles.settingsSection}>
            <View style={styles.themeSwitchContainer}>
              <Text>Dark Mode</Text>
              <Switch value={isDarkTheme} onValueChange={toggleTheme} />
            </View>
            <Button mode="outlined">
              <Link href="/about">About</Link>
            </Button>
            <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
              Log Out
            </Button>
          </View>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    padding: 20,
    borderRadius: 10,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  name: {
    marginLeft: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  saveButton: {
    marginTop: 10,
  },
  editButton: {
    alignSelf: "flex-end",
  },
  settingsSection: {
    marginTop: 20,
  },
  settingsButton: {
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    marginTop: 5,
  },
  themeSwitchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
});

export default Settings;
