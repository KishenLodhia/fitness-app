// Mood.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, Chip, TextInput, Button, Surface, Card, Dialog, Portal, FAB, useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MoodEntry {
  id: string;
  mood: string;
  notes: string;
  timestamp: string;
}

const Mood: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isDialogVisible, setDialogVisible] = useState<boolean>(false);

  const { colors } = useTheme();

  const moods = [
    { name: "Happy", color: colors.primary },
    { name: "Sad", color: colors.primary },
    { name: "Angry", color: colors.primary },
    { name: "Excited", color: colors.primary },
    { name: "Anxious", color: colors.primary },
    { name: "Calm", color: colors.primary },
  ];

  useEffect(() => {
    const loadMoods = async () => {
      const storedMoods = await AsyncStorage.getItem("moodEntries");
      if (storedMoods) {
        setMoodEntries(JSON.parse(storedMoods));
      }
    };

    loadMoods();
  }, []);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleSaveMood = async () => {
    if (selectedMood) {
      const newEntry: MoodEntry = {
        id: Math.random().toString(), // Unique ID for each entry
        mood: selectedMood,
        notes: notes,
        timestamp: new Date().toLocaleString(),
      };
      const updatedMoods = [newEntry, ...moodEntries];
      setMoodEntries(updatedMoods);
      await AsyncStorage.setItem("moodEntries", JSON.stringify(updatedMoods));
      // Clear selections after saving
      setSelectedMood(null);
      setNotes("");
      setDialogVisible(false);
    }
  };

  const renderMoodItem = ({ item }: { item: MoodEntry }) => {
    return (
      <Card style={styles.card}>
        <Card.Title title={item.mood} subtitle={item.timestamp} />
        <Card.Content>
          <Text>{item.notes}</Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={moodEntries}
        renderItem={renderMoodItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.header}>Previously Logged Moods</Text>}
      />
      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Log Your Mood</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.subtitle}>How are you feeling today?</Text>
            <View style={styles.chipsContainer}>
              {moods.map((mood) => (
                <Chip
                  key={mood.name}
                  selected={selectedMood === mood.name}
                  onPress={() => handleMoodSelect(mood.name)}
                  style={[styles.chip, selectedMood === mood.name && { backgroundColor: mood.color }]}
                >
                  {mood.name}
                </Chip>
              ))}
            </View>
            <TextInput
              label="Notes"
              value={notes}
              onChangeText={setNotes}
              mode="outlined"
              multiline
              style={styles.notesInput}
              placeholder="Add any additional information..."
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button mode="contained" onPress={handleSaveMood}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <FAB style={styles.fab} icon="plus" onPress={() => setDialogVisible(true)} label="Log Mood" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 16,
  },
  chip: {
    margin: 4,
  },
  notesInput: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});

export default Mood;
