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

        <Card mode="contained" style={styles.card}>
          <Card.Title
            title={
              <View style={styles.numbers}>
                <Text variant="bodyMedium">7 Day Average: </Text>
                <Text variant="headlineLarge">{pastStepCount.toLocaleString()} Steps</Text>
              </View>
            }
          />
          <Card.Content>
            {pastStepCount && pastStepCount < 5000 ? (
              <Text>Go for a short walk, it will help clear your mind. You've got this 💪💪</Text>
            ) : (
              <Text>You've reached your target. Keep up the good work 🏅🏅</Text>
            )}
          </Card.Content>
        </Card>

        <Card mode="contained" style={styles.card}>
          <Card.Content>
            <View style={styles.titleCard}>
              <Text variant="headlineMedium">Water:</Text>
              <Text variant="headlineLarge">{waterIntake} cups</Text>
            </View>
            <ProgressBar progress={2 / 8} color={"green"} />
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Category</DataTable.Title>
                <DataTable.Title numeric>Cups</DataTable.Title>
              </DataTable.Header>

              <DataTable.Row>
                <DataTable.Cell>Males</DataTable.Cell>
                <DataTable.Cell numeric>10</DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>Females</DataTable.Cell>
                <DataTable.Cell numeric>8</DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>Teenagers</DataTable.Cell>
                <DataTable.Cell numeric>6-8</DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>Children</DataTable.Cell>
                <DataTable.Cell numeric>4-5</DataTable.Cell>
              </DataTable.Row>
            </DataTable>
            <Text>(healthdirect.gov.au)</Text>
          </Card.Content>
          {/* <Card.Actions>
            <IconButton
              icon="minus"
              iconColor={"purple"}
              size={30}
              mode="outlined"
              onPress={() => setWaterIntake(waterIntake > 0 ? waterIntake - 1 : 0)}
            />
            <IconButton
              icon="plus"
              iconColor={"purple"}
              size={30}
              mode="outlined"
              onPress={() => setWaterIntake(waterIntake + 1)}
            />
          </Card.Actions> */}
        </Card>
        <Card mode="contained" style={styles.card}>
          <Card.Content>
            <View style={styles.titleCard}>
              <Text variant="headlineMedium">Mood:</Text>
              <Text variant="headlineLarge">{mood}</Text>
            </View>
            <Text>Your current mood is {mood}. Remember, it's okay to have bad days. Take care of yourself!</Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

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
});
