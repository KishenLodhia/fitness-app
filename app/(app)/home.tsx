import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import {
  Card,
  Title,
  TextInput,
  Avatar,
  IconButton,
  Text,
  Button,
  DataTable,
  List,
  ProgressBar,
} from "react-native-paper";
import { Pedometer } from "expo-sensors";
import { useNavigation } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSession } from "../ctx";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";

type PedometerData = {
  id: number;
  user_id: number;
  date: Date;
  steps: number;
  distance: null | number;
  created_at: Date;
  updated_at: Date;
};

type WaterIntakeData = {
  id: number;
  user_id: number;
  timestamp: Date;
  amount: number;
  created_at: Date;
  updated_at: Date;
};

export default function Home() {
  // hooks
  const navigation = useNavigation();
  const { user, isLoading } = useSession();
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [pastStepCount, setPastStepCount] = useState(0);
  const [mood, setMood] = useState("");
  const [waterIntake, setWaterIntake] = useState(0);
  const [steps, setSteps] = useState<number[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [waterIntakeAmounts, setWaterIntakeAmounts] = useState<number[]>([]);
  const [waterIntakeTimestamps, setWaterIntakeTimestamps] = useState<string[]>([]);
  const [todayWaterIntake, setTodayWaterIntake] = useState(0); // New state for today's water intake
  const [averageWaterIntake, setAverageWaterIntake] = useState(0); // New state for average water intake

  // useEffects
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // use effect for pedometer entries
  useEffect(() => {
    subscribe();
  }, []);

  useEffect(() => {
    getPedometerData();
    getWaterIntakeData();
  }, []);

  // helper functions
  const getPedometerData = async () => {
    try {
      const response = await axios.get(
        `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/${user?.id}/pedometer_entries`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        const responseData: PedometerData[] = response.data;
        const steps = responseData.map((item) => item.steps);
        const dates: string[] = responseData.map((item) =>
          new Date(item.date).toLocaleDateString(undefined, { day: "2-digit", month: "2-digit" })
        );
        setSteps(steps.toReversed());
        setDates(dates.toReversed());
        console.log(response.data);
      } else {
        throw new Error("An error occured");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getWaterIntakeData = async () => {
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
        const responseData: WaterIntakeData[] = response.data;
        const amounts = responseData.map((item) => item.amount);
        const timestamps: string[] = responseData.map((item) =>
          new Date(item.timestamp).toLocaleDateString(undefined, { day: "2-digit", month: "2-digit" })
        );

        // Calculate today's water intake
        const todayIntake = amounts.reduce((sum, amount, index) => {
          if (timestamps[index] === new Date().toLocaleDateString(undefined, { day: "2-digit", month: "2-digit" })) {
            return sum + amount;
          }
          return sum;
        }, 0);
        setTodayWaterIntake(todayIntake);

        // Calculate average water intake
        const averageIntake = Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length);
        setAverageWaterIntake(averageIntake);

        setWaterIntakeAmounts(amounts.reverse());
        setWaterIntakeTimestamps(timestamps.reverse());
        console.log(response.data);
      } else {
        throw new Error("An error occurred");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
      if (pastStepCountResult) {
        setPastStepCount(pastStepCountResult.steps);
      }
    }
  };

  // const dates = pedometerData.map((item) => new Date(item.date).toLocaleDateString());
  // const steps = pedometerData.map((item) => item.steps);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text variant="displaySmall">Dashboard</Text>
        <Text variant="labelLarge">Steps</Text>
        {steps && steps.length > 0 ? (
          <LineChart
            data={{
              labels: dates,
              datasets: [
                {
                  data: steps,
                },
              ],
            }}
            width={Dimensions.get("window").width - 2 * 20}
            height={220}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              borderRadius: 16,
              margin: 10,
            }}
          />
        ) : (
          <Text>No data available</Text>
        )}
        <View style={styles.numbers}>
          <View style={styles.numberEach}>
            <Text variant="displaySmall">{pastStepCount.toLocaleString()}</Text>
            <Text variant="bodySmall">Today</Text>
          </View>
          <View style={styles.numberEach}>
            <Text variant="displaySmall">
              {Math.round(steps.reduce((a, b) => a + b, 0) / steps.length).toLocaleString()}
            </Text>
            <Text variant="bodySmall">7 Day Average</Text>
          </View>
        </View>

        <Text variant="labelLarge">Water Intake</Text>
        {waterIntakeAmounts && waterIntakeAmounts.length > 0 ? (
          <LineChart
            fromZero
            data={{
              labels: dates,
              datasets: [
                {
                  data: waterIntakeAmounts,
                },
              ],
            }}
            width={Dimensions.get("window").width - 2 * 20}
            height={220}
            chartConfig={{
              backgroundColor: "#2974FA", // Background color
              backgroundGradientFrom: "#2974FA", // Gradient start color
              backgroundGradientTo: "#6DD5FA", // Gradient end color
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Label text color
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Label color
              propsForDots: {
                r: "6", // Dot radius
                strokeWidth: "2",
                stroke: "#fff", // Dot border color
              },
            }}
            bezier
            style={{
              borderRadius: 16,
              margin: 10,
            }}
          />
        ) : (
          <Text>No data available</Text>
        )}

        <View style={styles.numbers}>
          <View style={styles.numberEach}>
            <Text variant="displaySmall">{todayWaterIntake.toLocaleString()}</Text>
            <Text variant="bodySmall">Today</Text>
          </View>
          <View style={styles.numberEach}>
            <Text variant="displaySmall">{averageWaterIntake.toLocaleString()}</Text>
            <Text variant="bodySmall">7 Day Average</Text>
          </View>
        </View>

        <Card mode="contained" style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text variant="headlineMedium" style={styles.cardTitle}>
              Important Information
            </Text>
            <View style={styles.infoSection}>
              <Text>
                <Text style={styles.boldText}>Mood:</Text> It's okay to have bad days. Remember to practice self-care
                and reach out for support when needed.
              </Text>
              <Text>
                <Text style={styles.boldText}>Water Intake:</Text> Staying hydrated is crucial for your health and
                well-being. Aim for at least 8 glasses of water per day.
              </Text>
              {/* Add more information as needed */}
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  numbers: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 10,
  },
  numberEach: {
    // backgroundColor: "rgba(255, 165, 0, 0.5)",
    padding: 10,
    borderRadius: 15,
    alignContent: "center",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  cardContent: {
    padding: 10,
  },
  cardTitle: {
    marginBottom: 10,
    textAlign: "center",
  },
  infoSection: {
    marginTop: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
});
