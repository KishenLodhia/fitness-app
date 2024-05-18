import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Card, Title, TextInput, Avatar, IconButton, Text, Button, DataTable, List } from "react-native-paper";
import { Pedometer } from "expo-sensors";
import { useNavigation } from "expo-router";

export default function Home() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [pastStepCount, setPastStepCount] = useState(0);
  const [mood, setMood] = useState("");
  const [waterIntake, setWaterIntake] = useState(0);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);

      const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
      if (pastStepCountResult) {
        setPastStepCount(pastStepCountResult.steps);
      }
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Card mode="contained" style={styles.card}>
          <Card.Title
            title={
              <View style={styles.titleCard}>
                <Text variant="headlineMedium">Today:</Text>
                <Text variant="headlineLarge">{pastStepCount} Steps</Text>
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
          <Card.Actions>
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
          </Card.Actions>
        </Card>
        <View></View>
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
  secondCard: {},
});
