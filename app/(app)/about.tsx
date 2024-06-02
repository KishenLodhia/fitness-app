import React from "react";
import { View, StyleSheet, ScrollView, Linking } from "react-native";
import { Text, Card, Title, Button } from "react-native-paper";

const About: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card mode="contained" style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Title style={styles.title}>About This Fitness App</Title>
          <Text style={styles.description}>
            This Fitness App is designed to help you track your fitness progress, stay motivated, and achieve your
            health goals. It features:
          </Text>
          <Text style={styles.feature}>- Step tracking: Monitor your daily steps and see your progress over time.</Text>
          <Text style={styles.feature}>
            - Water intake tracking: Stay hydrated and keep track of your daily water consumption.
          </Text>
          <Text style={styles.feature}>
            - Mood tracking: Track your mood to understand your emotional well-being and identify patterns.
          </Text>
          <Text style={styles.description}>
            We believe that fitness is a journey, not a destination. This app is here to support you every step of the
            way.
          </Text>
        </Card.Content>
      </Card>

      <Card mode="contained" style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Title style={styles.title}>Open Source Licenses</Title>
          <Text style={styles.description}>
            This application utilizes various open-source libraries. You can find their licenses below.
          </Text>
          <View style={styles.licenseList}>
            {/* Manual license entries for the packages you used */}
            <Text style={styles.licenseEntry}>
              <Text style={styles.boldText}>expo-router:</Text>{" "}
              <Button
                onPress={() => Linking.openURL("https://github.com/expo/expo/blob/main/packages/expo-router/LICENSE")}
              >
                MIT License
              </Button>
            </Text>
            <Text style={styles.licenseEntry}>
              <Text style={styles.boldText}>expo-sensors:</Text>{" "}
              <Button
                onPress={() => Linking.openURL("https://github.com/expo/expo/blob/main/packages/expo-sensors/LICENSE")}
              >
                MIT License
              </Button>
            </Text>
            <Text style={styles.licenseEntry}>
              <Text style={styles.boldText}>react-native-paper:</Text>{" "}
              <Button
                onPress={() => Linking.openURL("https://github.com/callstack/react-native-paper/blob/main/LICENSE")}
              >
                MIT License
              </Button>
            </Text>
            <Text style={styles.licenseEntry}>
              <Text style={styles.boldText}>react-native-chart-kit:</Text>{" "}
              <Button
                onPress={() =>
                  Linking.openURL("https://github.com/indiespirit/react-native-chart-kit/blob/master/LICENSE")
                }
              >
                MIT License
              </Button>
            </Text>
            <Text style={styles.licenseEntry}>
              <Text style={styles.boldText}>react-native-toast-notifications:</Text>{" "}
              <Button
                onPress={() =>
                  Linking.openURL("https://github.com/devfd/react-native-toast-notifications/blob/main/LICENSE")
                }
              >
                MIT License
              </Button>
            </Text>
            <Text style={styles.licenseEntry}>
              <Text style={styles.boldText}>@react-native-async-storage/async-storage:</Text>{" "}
              <Button
                onPress={() =>
                  Linking.openURL("https://github.com/react-native-community/async-storage/blob/main/LICENSE")
                }
              >
                MIT License
              </Button>
            </Text>
            {/* Add more license entries as needed */}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    margin: 10,
    borderRadius: 16,
    elevation: 5,
  },
  cardContent: {
    padding: 10,
  },
  title: {
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    marginBottom: 10,
  },
  feature: {
    marginLeft: 20,
    marginBottom: 5,
  },
  licenseList: {
    marginTop: 10,
  },
  licenseEntry: {
    marginBottom: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
});

export default About;
