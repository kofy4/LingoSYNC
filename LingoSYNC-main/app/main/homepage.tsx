import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AppState,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StorageService } from "../utils/StorageService";

const { width } = Dimensions.get("window");

const Homepage = () => {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState("Beginner");
  const [stats, setStats] = useState({
    streak: 0,
    hoursPracticed: 0,
    wordsLearned: 0,
  });

  const appState = useRef(AppState.currentState);
  const timeInApp = useRef(0);

  const fetchStats = useCallback(async () => {
    const streak = await StorageService.getStreak();
    const hoursPracticed = await StorageService.getHoursPracticed();
    const learnedWords = await StorageService.getLearnedWords();
    setStats({
      streak,
      hoursPracticed,
      wordsLearned: learnedWords.length,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats])
  );

  useEffect(() => {
    const checkStreak = async () => {
      const today = new Date().toDateString();
      const lastLogin = await StorageService.getLastLogin();
      const streak = await StorageService.getStreak();

      if (lastLogin !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastLogin === yesterday.toDateString()) {
          await StorageService.setStreak(streak + 1);
        } else {
          await StorageService.setStreak(1);
        }
        await StorageService.setLastLogin(today);
      }
    };

    checkStreak();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        checkStreak();
      }
      appState.current = nextAppState;
    });

    const timer = setInterval(() => {
      timeInApp.current += 1;
      if (timeInApp.current >= 3600) {
        StorageService.addHourPracticed().then(() => {
          fetchStats();
        });
        timeInApp.current = 0;
      }
    }, 1000);

    return () => {
      subscription.remove();
      clearInterval(timer);
    };
  }, [fetchStats]);

  const quickAccessItems = [
    {
      id: "pronunciation",
      title: "Pronunciation Practice",
      icon: "mic",
      color: "#757BFD",
      route: "/main/pronunciation-practice",
    },
    {
      id: "conversation",
      title: "Conversation",
      icon: "chatbubble",
      color: "#4CAF50",
      route: "/main/conversation",
    },
  ];

  const proficiencyLevels = [
    { id: "beginner", name: "Beginner", unlocked: true },
    {
      id: "intermediate",
      name: "Intermediate",
      unlocked: false,
      comingSoon: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>LingoSYNC</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person-circle" size={32} color="#757BFD" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressCard}>
              <Ionicons name="flame" size={24} color="#FFD700" />
              <Text style={styles.progressLabel}>Streak</Text>
              <Text style={styles.progressValue}>{stats.streak} Day(s)</Text>
            </View>
            <View style={styles.progressCard}>
              <Ionicons name="time" size={24} color="#757BFD" />
              <Text style={styles.progressLabel}>Hours Practiced</Text>
              <Text style={styles.progressValue}>
                {stats.hoursPracticed.toFixed(1)}
              </Text>
            </View>
            <View style={styles.progressCard}>
              <Ionicons name="book" size={24} color="#4CAF50" />
              <Text style={styles.progressLabel}>Words Learned</Text>
              <Text style={styles.progressValue}>{stats.wordsLearned}</Text>
            </View>
          </View>
        </View>

        {/* Proficiency Level Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Proficiency Level</Text>
          <View style={styles.proficiencyContainer}>
            {proficiencyLevels.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.proficiencyButton,
                  selectedLevel === level.name &&
                    styles.proficiencyButtonSelected,
                  !level.unlocked && styles.proficiencyButtonLocked,
                ]}
                onPress={() => level.unlocked && setSelectedLevel(level.name)}
                disabled={!level.unlocked}
              >
                <View style={styles.proficiencyContent}>
                  <Text
                    style={[
                      styles.proficiencyText,
                      selectedLevel === level.name &&
                        styles.proficiencyTextSelected,
                      !level.unlocked && styles.proficiencyTextLocked,
                    ]}
                  >
                    {level.name}
                  </Text>
                  {!level.unlocked && (
                    <View style={styles.lockContainer}>
                      {level.comingSoon && (
                        <Text style={styles.comingSoonText}>
                          Feature coming soon
                        </Text>
                      )}
                      <Ionicons name="lock-closed" size={16} color="#999" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Access Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickAccessContainer}>
            {quickAccessItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.quickAccessCard}
                onPress={() => router.push(item.route as any)}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${item.color}15` },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={32}
                    color={item.color}
                  />
                </View>
                <Text style={styles.quickAccessTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional Learning Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Time Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {stats.hoursPracticed.toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>Hours Practiced</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.wordsLearned}</Text>
              <Text style={styles.statLabel}>Words Learned</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#757BFD",
  },
  profileButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  progressCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  progressValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  proficiencyContainer: {
    gap: 12,
  },
  proficiencyButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  proficiencyButtonSelected: {
    borderColor: "#757BFD",
    backgroundColor: "#757BFD08",
  },
  proficiencyButtonLocked: {
    backgroundColor: "#f8f9fa",
    borderColor: "#e9ecef",
  },
  proficiencyContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  proficiencyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  proficiencyTextSelected: {
    color: "#757BFD",
    fontWeight: "600",
  },
  proficiencyTextLocked: {
    color: "#999",
  },
  lockContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  comingSoonText: {
    fontSize: 12,
    color: "#999",
    marginRight: 8,
    fontStyle: "italic",
  },
  quickAccessContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  quickAccessCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quickAccessTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    lineHeight: 18,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#757BFD",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
});

export default Homepage;
