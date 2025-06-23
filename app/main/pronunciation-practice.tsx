import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PronunciationPractice() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Pronunciation Practice</Text>
        <Text style={styles.subtitle}>
          Improve your pronunciation with interactive exercises.
        </Text>
        <TouchableOpacity
          onPress={() => alert("Start Practice")}
          style={styles.micButton}
        >
          <Ionicons style={styles.mic} name="mic" size={100} color="black" />
        </TouchableOpacity>

        <Text style={styles.text}>Tap the microphone to start recording.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  illustration: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  mic: {
    marginVertical: 50,
    borderWidth: 1,
    borderColor: "#757BFD",
    shadowColor: "#757BFD",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 1000,
    padding: 50,
    backgroundColor: "#f9f9f9",
  },
  micButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
});
