import { useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>LingoSYNC</Text>
      <Text style={styles.title}>Unlock New Worlds</Text>
      <Text style={styles.subtitle}>
        Learn languages, connect with cultures.
      </Text>
      <Image
        source={require("../assets/images/partial-react-logo.png")}
        style={styles.illustration}
        resizeMode="cover"
      />
      <View style={{ flex: 1 }} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/signup")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 60,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#757BFD",
    marginBottom: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#888",
    marginBottom: 24,
    textAlign: "center",
  },
  illustration: {
    width: width,
    height: 120,
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#757BFD",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    width: width - 32,
    marginBottom: 32,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
