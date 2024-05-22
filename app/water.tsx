import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Card, ProgressBar, Text } from "react-native-paper";
import axios from "axios";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";

type WaterIntakeData = {
  id: number;
  user_id: number;
  timestamp: string;
  amount: number;
};

const WaterIntakeTracker = () => {
  const [waterIntakeData, setWaterIntakeData] = useState<WaterIntakeData[]>([]);

  useEffect(() => {
    const fetchWaterIntake = async () => {
      const user_id = "10"; // replace with your user id
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoiazRAZ21haWwuY29tIiwiZXhwIjoxNzE2NTYxMDcwLCJpYXQiOjE3MTU5NTYyNzB9.zUF_VQmGsrQdU6iE1ZO_OlS4zcaFl0uzMishTTxvNV8";
      try {
        const response = await axios.get(
          `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/${user_id}/water_intake`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWaterIntakeData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWaterIntake();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          {waterIntakeData.map((data) => (
            <Card key={data.id} mode="contained" style={styles.card}>
              <Card.Title
                title={
                  <View style={styles.titleCard}>
                    <Text variant="headlineSmall">{`${new Date(data.timestamp).toLocaleDateString()}`}</Text>
                  </View>
                }
              />
              <Card.Content>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text
                    style={{ fontFamily: "customFont", fontSize: 18 }}
                  >{`You've had ${data.amount} cups of water.`}</Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
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
    margin: 10,
    padding: 20,
  },
  titleCard: {
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },
  secondCard: {},
});

export default WaterIntakeTracker;
