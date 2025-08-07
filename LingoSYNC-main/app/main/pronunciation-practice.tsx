import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StorageService } from "../utils/StorageService";
import { calculateSimilarity } from "../utils/string-similarity";

const sampleWords = [
  "hello",
  "world",
  "react",
  "native",
  "language",
  "pronunciation",
  "practice",
  "excellent",
  "wonderful",
  "beautiful",
];

const PronunciationPractice = () => {
  const [selectedWord, setSelectedWord] = useState("hello");
  const [customWord, setCustomWord] = useState("");
  const [wordDetails, setWordDetails] = useState<any>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    handleWordSelect(selectedWord);
  }, []);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handleWordSelect = async (word: string) => {
    setSelectedWord(word);
    setScore(null);
    setWordDetails(null);
    setRecordingUri(null);
    setLoading(true);
    setError(null);

    await StorageService.addLearnedWord(word);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      if (!response.ok) {
        throw new Error("Word not found. Please try another word.");
      }
      const data = await response.json();
      setWordDetails(data[0]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomWordSubmit = () => {
    if (customWord.trim()) {
      handleWordSelect(customWord.trim().toLowerCase());
      setCustomWord("");
      Keyboard.dismiss();
    }
  };

  const handleRecord = async () => {
    if (isRecording) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsRecording(false);
      await recording?.stopAndUnloadAsync();
      const uri = recording?.getURI();
      if (uri) {
        setRecordingUri(uri);
        processRecording(uri);
      }
      setRecording(null);
    } else {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need microphone permissions to make this work!");
          return;
        }

        setScore(null);
        setRecordingUri(null);
        setIsRecording(true);

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);

        timeoutRef.current = setTimeout(() => {
          handleRecord();
        }, 5000);
      } catch (err) {
        console.error("Failed to start recording", err);
        setError("Failed to start recording.");
        setIsRecording(false);
      }
    }
  };

  const processRecording = async (uri: string) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri,
        type: "audio/x-m4a",
        name: "audio.m4a",
      } as any);
      formData.append("model", "whisper-large-v3");

      const response = await fetch(
        "https://api.groq.com/openai/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_GROQ_API_KEY}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      console.log(data.text);

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to transcribe audio.");
      }

      const transcribedText = data.text;
      const similarity = calculateSimilarity(selectedWord, transcribedText);
      setScore(Math.round(similarity));
    } catch (err: any) {
      setError("Failed to process audio. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const playSound = async (audioUrl: string) => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: audioUrl,
    });
    setSound(newSound);
    await newSound.playAsync();
  };

  const getScoreColor = (value: number) => {
    if (value < 10) return "#ff4d4f";
    if (value < 70) return "#faad14";
    return "#52c41a";
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pronunciation Practice</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Sample Words</Text>
          <FlatList
            data={sampleWords}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sampleWordsContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.wordChip,
                  selectedWord === item && styles.selectedWordChip,
                ]}
                onPress={() => handleWordSelect(item)}
              >
                <Text
                  style={[
                    styles.wordChipText,
                    selectedWord === item && styles.selectedWordChipText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />

          <Text style={styles.sectionTitle}>Check a Custom Word</Text>
          <View style={styles.customWordContainer}>
            <TextInput
              style={styles.textInput}
              value={customWord}
              onChangeText={setCustomWord}
              placeholder="Enter a word..."
              placeholderTextColor="#999"
              onSubmitEditing={handleCustomWordSubmit}
            />
            <TouchableOpacity
              style={styles.checkButton}
              onPress={handleCustomWordSubmit}
            >
              <Text style={styles.checkButtonText}>Check</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.wordDetailsContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#757BFD" />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <>
                <Text style={styles.selectedWordText}>{selectedWord}</Text>
                {wordDetails?.phonetic && (
                  <Text style={styles.phoneticText}>
                    {wordDetails.phonetic}
                  </Text>
                )}
                {wordDetails?.phonetics?.find((p: any) => p.audio)?.audio && (
                  <TouchableOpacity
                    onPress={() =>
                      playSound(
                        wordDetails.phonetics.find((p: any) => p.audio)?.audio
                      )
                    }
                    style={styles.audioButton}
                  >
                    <Ionicons name="volume-high" size={24} color="#fff" />
                    <Text style={styles.audioButtonText}>Listen</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          {recordingUri && !loading && (
            <TouchableOpacity
              onPress={() => playSound(recordingUri)}
              style={styles.playRecordingButton}
            >
              <Ionicons name="play-circle" size={24} color="#fff" />
              <Text style={styles.audioButtonText}>Play Your Recording</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordButtonRecording,
            ]}
            onPress={handleRecord}
            disabled={loading}
          >
            <Ionicons
              name={isRecording ? "stop-circle" : "mic-circle"}
              size={64}
              color="#fff"
            />
          </TouchableOpacity>
          <Text style={styles.recordButtonText}>
            {isRecording
              ? "Recording..."
              : score === null
              ? "Tap to Record"
              : "Record Again"}
          </Text>

          {score !== null && !loading && (
            <View style={styles.scoreContainer}>
              <Text style={[styles.scoreText, { color: getScoreColor(score) }]}>
                Your score: {score}%
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  sampleWordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
    justifyContent: "center",
  },
  wordChip: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  selectedWordChip: {
    backgroundColor: "#757BFD",
  },
  wordChipText: {
    color: "#333",
  },
  selectedWordChipText: {
    color: "#fff",
  },
  customWordContainer: {
    flexDirection: "row",
    width: "100%",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  checkButton: {
    backgroundColor: "#757BFD",
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
    marginLeft: 10,
  },
  checkButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  wordDetailsContainer: {
    marginTop: 30,
    alignItems: "center",
    minHeight: 150,
    justifyContent: "center",
  },
  selectedWordText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  phoneticText: {
    fontSize: 18,
    color: "#666",
    marginTop: 5,
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#757BFD",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
  },
  audioButtonText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  playRecordingButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
    alignSelf: "center",
  },
  recordButton: {
    alignSelf: "center",
    marginTop: 30,
    backgroundColor: "#757BFD",
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recordButtonRecording: {
    backgroundColor: "#FF6347",
  },
  recordButtonText: {
    textAlign: "center",
    marginTop: 10,
    fontWeight: "500",
    fontSize: 16,
  },
  scoreContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default PronunciationPractice;
