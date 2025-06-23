import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PronunciationPractice() {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Pronunciation Practice</Text>
        <Text style={styles.subtitle}>
            Improve your pronunciation with interactive exercises.
        </Text>
        <Image
            source={require("../assets/images/pronunciation-illustration.png")}
            style={styles.illustration}
            resizeMode="cover"
        />
        <TouchableOpacity style={styles.button} onPress={() => alert("Start Practice")}>
            <Text style={styles.buttonText}>Start Practice</Text>
        </TouchableOpacity>
        </View>
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
});