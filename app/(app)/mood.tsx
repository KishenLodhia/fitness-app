import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Card, useTheme, Badge, FAB, Portal, Modal, TextInput, Button, Chip } from "react-native-paper";
import axios from "axios";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSession } from "../ctx";

interface MoodEntry {
  id: string;
  mood: string;
  notes: string;
  timestamp: string;
}

const Mood: React.FC = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMood, setNewMood] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editEntryId, setEditEntryId] = useState("");
  const { colors } = useTheme();
  const { user, isLoading } = useSession();

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    try {
      const response = await axios.get(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/${user?.id}/moods`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.status === 200) {
        const moods = response.data;
        setMoodEntries(moods);
      } else {
        throw new Error("Failed to fetch moods");
      }
    } catch (error) {
      console.error("Error fetching mood data:", error);
    }
  };

  const addMood = async () => {
    try {
      const response = await axios.post(
        `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/${user?.id}/moods`,
        {
          mood: selectedMood,
          notes: newMood,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status === 201) {
        fetchMoods();
        setModalVisible(false);
        setNewMood("");
        setSelectedMood("");
      } else {
        throw new Error("Failed to add mood");
      }
    } catch (error) {
      console.error("Error adding mood:", error);
    }
  };

  const editMood = async () => {
    try {
      const response = await axios.put(
        `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/${user?.id}/moods/${editEntryId}`,
        {
          mood: selectedMood,
          notes: newMood,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchMoods();
        setModalVisible(false);
        setNewMood("");
        setSelectedMood("");
        setEditMode(false);
        setEditEntryId("");
      } else {
        throw new Error("Failed to edit mood");
      }
    } catch (error) {
      console.error("Error editing mood:", error);
    }
  };

  const deleteMood = async (entryId: string) => {
    try {
      const response = await axios.delete(
        `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/${user?.id}/moods/${entryId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchMoods();
      } else {
        throw new Error("Failed to delete mood");
      }
    } catch (error) {
      console.error("Error deleting mood:", error);
    }
  };

  const handleEditMood = (item: MoodEntry) => {
    setEditMode(true);
    setModalVisible(true);
    setSelectedMood(item.mood);
    setNewMood(item.notes);
    setEditEntryId(item.id);
  };

  const handleDeleteMood = (entryId: string) => {
    Alert.alert(
      "Delete Mood",
      "Are you sure you want to delete this mood?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteMood(entryId),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const openAddModal = () => {
    setModalVisible(true);
    setEditMode(false);
    setSelectedMood("");
    setNewMood("");
    setEditEntryId("");
  };

  const moodOptions = [
    { label: "Happy", value: "Happy" },
    { label: "Sad", value: "Sad" },
    { label: "Excited", value: "Excited" },
    { label: "Peaceful", value: "Peaceful" },
    { label: "Anxious", value: "Anxious" },
    // Add more mood options as needed
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {moodEntries.map((data) => (
          <Card key={data.id} mode="outlined" style={styles.card}>
            <Card.Title
              title={`Mood - ${new Date(data.timestamp).toLocaleDateString()}`}
              right={() => (
                <Badge style={{ alignSelf: "center" }}>{new Date(data.timestamp).toLocaleTimeString()}</Badge>
              )}
            />
            <Card.Content>
              <Text style={styles.moodText}>{`Mood: ${data.mood}`}</Text>
              <Text style={styles.notesText}>{`Notes: ${data.notes || "No notes"}`}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => handleEditMood(data)}>Edit</Button>
              <Button onPress={() => handleDeleteMood(data.id)}>Delete</Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>{editMode ? "Edit Mood" : "Add Mood"}</Text>
          <View style={styles.chipsContainer}>
            {moodOptions.map((option) => (
              <Chip
                key={option.value}
                selected={selectedMood === option.value}
                onPress={() => setSelectedMood(option.value)}
                style={styles.chip}
              >
                {option.label}
              </Chip>
            ))}
          </View>
          <TextInput
            label="Notes (optional)"
            value={newMood}
            onChangeText={(text) => setNewMood(text)}
            style={styles.input}
          />
          <Button mode="contained" onPress={editMode ? editMood : addMood} style={styles.modalButton}>
            {editMode ? "Save Changes" : "Add Mood"}
          </Button>
        </Modal>
      </Portal>

      <FAB style={styles.fab} icon="plus" onPress={openAddModal} />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
  },
  moodText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
  },
  notesText: {
    fontSize: 14,
    color: "#777",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 50,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    marginBottom: 10,
  },
  modalButton: {
    marginTop: 10,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  chip: {
    margin: 4,
  },
});

export default Mood;
