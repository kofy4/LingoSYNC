import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Signup() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#bbb"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Create a password"
          placeholderTextColor="#bbb"
          secureTextEntry
        />
        <TouchableOpacity style={styles.signupButton}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.terms}>
          Already have an account?{" "}
          <Text style={styles.link} onPress={() => router.push("/login")}>
            Login
          </Text>
        </Text>
      </View>
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>
      <TouchableOpacity style={styles.facebookButton}>
        <Ionicons
          name="logo-facebook"
          size={20}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.facebookButtonText}>Sign up with Facebook</Text>
      </TouchableOpacity>
      <Text style={styles.terms}>
        By signing up, you agree to our{" "}
        <Text style={styles.link}>Terms of Service</Text>
      </Text>
    </View>
  );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "500",
    marginTop: 60,
    marginBottom: 32,
    color: "#444",
    textAlign: "center",
  },
  form: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    height: 40,
    borderColor: "#eee",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
    color: "#222",
  },
  signupButton: {
    backgroundColor: "#757BFD",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    width: width - 32,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#eee",
  },
  orText: {
    marginHorizontal: 8,
    color: "#bbb",
    fontSize: 13,
  },
  facebookButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1877f3",
    borderRadius: 6,
    paddingVertical: 12,
    justifyContent: "center",
    width: "90%",
    marginHorizontal: 16,
    marginBottom: 18,
  },
  facebookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  terms: {
    color: "#bbb",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  link: {
    color: "#757BFD",
    textDecorationLine: "underline",
  },
});
