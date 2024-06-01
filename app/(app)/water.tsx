import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Card, Text, Button, FAB, Portal, Modal } from "react-native-paper";
import axios, { AxiosError } from "axios";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSession } from "../ctx";

type WaterIntakeData = {
  id: number;
  user_id: number;
  timestamp: string;
  amount: number;
};

const WaterIntakeTracker = () => {
  const [waterIntakeData, setWaterIntakeData] = useState<WaterIntakeData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAmount, setNewAmount] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editEntryId, setEditEntryId] = useState<number | null>(null);
  const { user, isLoading } = useSession();

  useEffect(() => {
    fetchWaterIntake();
  }, []);

  const fetchWaterIntake = async () => {
    try {
      const response = await axios.get(
        `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/${user?.id}/water_intake`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status === 200) {
        const waterIntake = response.data;
        setWaterIntakeData(waterIntake);
      } else {
        throw new Error("Failed to fetch water intake data");
      }
    } catch (error) {
      console.error("Error fetching water intake data:", error);
    }
  };

  const addWaterIntake = async () => {
    try {
      console.log(newAmount);
      console.log(new Date().toISOString());
      const response = await axios.post(
        `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/${user?.id}/water_intake`,
        {
          amount: newAmount,
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status === 201) {
        fetchWaterIntake();
        setModalVisible(false);
        setNewAmount(0);
      } else {
        throw new Error("Failed to add water intake");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.error("Error data:", axiosError.response.data);
          console.error("Error status:", axiosError.response.status);
          console.error("Error headers:", axiosError.response.headers);
        } else if (axiosError.request) {
          console.error("No response received:", axiosError.request);
        } else {
          console.error("Error", axiosError.message);
        }
      }
    }
  };

  const editWaterIntake = async () => {
    try {
      const response = await axios.put(
        `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/${user?.id}/water_intake/${editEntryId}`,
        {
          amount: newAmount,
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchWaterIntake();
        setModalVisible(false);
        setNewAmount(0);
        setEditMode(false);
        setEditEntryId(null);
      } else {
        throw new Error("Failed to edit water intake");
      }
    } catch (error) {
      console.error("Error editing water intake:", error);
    }
  };

  const deleteWaterIntake = async (entryId: number) => {
    try {
      const response = await axios.delete(
        `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/${user?.id}/water_intake/${entryId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchWaterIntake();
      } else {
        throw new Error("Failed to delete water intake");
      }
    } catch (error) {
      console.error("Error deleting water intake:", error);
    }
  };

  const handleEditWaterIntake = (item: WaterIntakeData) => {
    setEditMode(true);
    setModalVisible(true);
    setNewAmount(item.amount);
    setEditEntryId(item.id);
  };

  const handleDeleteWaterIntake = (entryId: number) => {
    Alert.alert(
      "Delete Water Intake",
      "Are you sure you want to delete this water intake entry?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteWaterIntake(entryId),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const incrementAmount = () => {
    setNewAmount(newAmount + 1);
  };

  const decrementAmount = () => {
    if (newAmount > 0) {
      setNewAmount(newAmount - 1);
    }
  };

  const openAddModal = () => {
    setModalVisible(true);
    setEditMode(false);
    setNewAmount(0);
    setEditEntryId(null);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          {waterIntakeData.map((data) => (
            <Card key={data.id} mode="contained" style={styles.card}>
              <Card.Title
                title={`${new Date(data.timestamp).toLocaleDateString()}`}
                right={() => (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text>{`Amount: ${data.amount} cups`}</Text>
                  </View>
                )}
              />
              <Card.Actions>
                <Button onPress={() => handleEditWaterIntake(data)}>Edit</Button>
                <Button onPress={() => handleDeleteWaterIntake(data.id)}>Delete</Button>
              </Card.Actions>
            </Card>
          ))}
        </View>
      </ScrollView>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>{editMode ? "Edit Water Intake" : "Add Water Intake"}</Text>
          <View style={styles.amountControl}>
            <Button onPress={decrementAmount}>-</Button>
            <Text style={styles.amountText}>{newAmount} cups</Text>
            <Button onPress={incrementAmount}>+</Button>
          </View>
          <Button mode="contained" onPress={editMode ? editWaterIntake : addWaterIntake} style={styles.modalButton}>
            {editMode ? "Save Changes" : "Add Water Intake"}
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
    width: "100%",
  },
  card: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
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
  modalButton: {
    marginTop: 10,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  amountControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  amountText: {
    fontSize: 18,
    marginHorizontal: 20,
  },
});

export default WaterIntakeTracker;
