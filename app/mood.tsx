import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card, useTheme, Badge } from "react-native-paper";
import axios from "axios";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface MoodEntry {
  id: string;
  mood: string;
  notes: string;
  timestamp: string;
}

const Mood: React.FC = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const { colors } = useTheme();

  useEffect(() => {
    const loadMoods = async () => {
      try {
        const user_id = "10"; // replace with your user id
        const email = "k@gmail.com";
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoiazRAZ21haWwuY29tIiwiZXhwIjoxNzE2NTYxMDcwLCJpYXQiOjE3MTU5NTYyNzB9.zUF_VQmGsrQdU6iE1ZO_OlS4zcaFl0uzMishTTxvNV8";

        const response = await axios.get(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/${user_id}/moods`, {
          params: { email: email },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const moods = response.data;
        setMoodEntries(moods);
      } catch (error: any) {
        console.error("Failed to load moods", error);
        console.log("Error response:", error.response);
      }
    };

    loadMoods();
  }, []);

  const renderMoodItem = ({ item }: { item: MoodEntry }) => {
    return (
      <Card mode="contained" style={styles.card}>
        <Card.Title title={`Mood - ${new Date(item.timestamp).toLocaleDateString()}`} />
        <Card.Content>
          <Text style={styles.moodText}>{`Mood: ${item.mood}`}</Text>
          <Text style={styles.notesText}>{`Notes: ${item.notes || "No notes"}`}</Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {moodEntries.map((data) => (
          <Card key={data.id} mode="contained" style={styles.card}>
            <Card.Title
              title={`Mood - ${new Date(data.timestamp).toLocaleDateString()}`}
              titleStyle={styles.cardTitle}
              right={() => (
                <Badge style={{ alignSelf: "center" }}>{new Date(data.timestamp).toLocaleTimeString()}</Badge>
              )}
            />

            <Card.Content>
              <Text style={styles.moodText}>{`Mood: ${data.mood}`}</Text>
              <Text style={styles.notesText}>{`Notes: ${data.notes || "No notes"}`}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
  },
  card: {
    marginBottom: 20,
    padding: 15,

    borderRadius: 10,
  },
  cardTitle: {
    fontFamily: "customFont",
    fontSize: 18,
    color: "#333",
  },
  moodText: {
    fontFamily: "customFont",
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
  },
  notesText: {
    fontFamily: "customFont",
    fontSize: 14,
    color: "#777",
  },
});

export default Mood;
