import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Language {
  id: string;
  name: string;
  icon: string;
  isNew?: boolean;
}

const LanguageSetup = () => {
  const router = useRouter();
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const languages: Language[] = [
    { id: "spanish", name: "Spanish", icon: "globe" },
    { id: "french", name: "French", icon: "library", isNew: true },
    { id: "german", name: "German", icon: "star" },
    { id: "japanese", name: "Japanese", icon: "megaphone" },
    { id: "chinese", name: "Chinese", icon: "home" },
    { id: "arabic", name: "Arabic", icon: "person" },
  ];

  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguages((prev) => {
      if (prev.includes(languageId)) {
        return prev.filter((id) => id !== languageId);
      } else {
        return [...prev, languageId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedLanguages.length === 0) {
      Alert.alert(
        "Select Languages",
        "Please select at least one language to continue."
      );
      return;
    }

    // Save the selected languages (in a real app, this would be stored in AsyncStorage or a database)
    console.log("Selected languages:", selectedLanguages);

    // Navigate to the main app
    router.replace("/main/homepage");
  };

  const handleSkip = () => {
    router.replace("/main/homepage");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LingoSYNC Setup</Text>
        <View style={styles.headerRight}></View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>Choose Your Path to Fluency</Text>
          <Text style={styles.subtitle}>
            Select the languages you wish to learn and your current proficiency
            level to personalize your learning journey.
          </Text>

          {/* Learning Languages Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Learning Languages</Text>
            <View style={styles.languagesGrid}>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.id}
                  style={[
                    styles.languageCard,
                    selectedLanguages.includes(language.id) &&
                      styles.languageCardSelected,
                  ]}
                  onPress={() => handleLanguageSelect(language.id)}
                >
                  <View style={styles.languageIconContainer}>
                    <Ionicons
                      name={language.icon as any}
                      size={32}
                      color={
                        selectedLanguages.includes(language.id)
                          ? "#757BFD"
                          : "#666"
                      }
                    />
                    {language.isNew && (
                      <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>New</Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.languageName,
                      selectedLanguages.includes(language.id) &&
                        styles.languageNameSelected,
                    ]}
                  >
                    {language.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Selected Languages Display */}
          {selectedLanguages.length > 0 && (
            <View style={styles.selectedSection}>
              <Text style={styles.selectedTitle}>Selected Languages:</Text>
              <View style={styles.selectedLanguages}>
                {selectedLanguages.map((langId) => {
                  const language = languages.find((l) => l.id === langId);
                  return (
                    <View key={langId} style={styles.selectedLanguageTag}>
                      <Text style={styles.selectedLanguageText}>
                        {language?.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleLanguageSelect(langId)}
                      >
                        <Ionicons name="close" size={16} color="#757BFD" />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedLanguages.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#757BFD",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIcon: {
    padding: 4,
  },
  profileIcon: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  languagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
  languageCard: {
    width: "45%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageCardSelected: {
    borderColor: "#757BFD",
    backgroundColor: "#757BFD08",
  },
  languageIconContainer: {
    position: "relative",
    marginBottom: 12,
  },
  newBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
  },
  languageName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  languageNameSelected: {
    color: "#757BFD",
    fontWeight: "600",
  },
  selectedSection: {
    marginTop: 20,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  selectedLanguages: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectedLanguageTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#757BFD15",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  selectedLanguageText: {
    fontSize: 14,
    color: "#757BFD",
    fontWeight: "500",
  },
  bottomActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  skipButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  continueButton: {
    flex: 2,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#757BFD",
    borderRadius: 12,
  },
  continueButtonDisabled: {
    backgroundColor: "#ccc",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default LanguageSetup;
