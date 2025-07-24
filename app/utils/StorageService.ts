import AsyncStorage from "@react-native-async-storage/async-storage";

const STREAK_KEY = "user_streak";
const LAST_LOGIN_KEY = "last_login_date";
const HOURS_PRACTICED_KEY = "hours_practiced";
const LEARNED_WORDS_KEY = "learned_words";

export const StorageService = {
  async getStreak(): Promise<number> {
    const streak = await AsyncStorage.getItem(STREAK_KEY);
    return streak ? parseInt(streak, 10) : 0;
  },

  async setStreak(streak: number): Promise<void> {
    await AsyncStorage.setItem(STREAK_KEY, streak.toString());
  },

  async getLastLogin(): Promise<string | null> {
    return AsyncStorage.getItem(LAST_LOGIN_KEY);
  },

  async setLastLogin(date: string): Promise<void> {
    await AsyncStorage.setItem(LAST_LOGIN_KEY, date);
  },

  async getHoursPracticed(): Promise<number> {
    const hours = await AsyncStorage.getItem(HOURS_PRACTICED_KEY);
    return hours ? parseFloat(hours) : 0;
  },

  async addHourPracticed(): Promise<void> {
    const hours = await this.getHoursPracticed();
    await AsyncStorage.setItem(HOURS_PRACTICED_KEY, (hours + 1).toString());
  },

  async getLearnedWords(): Promise<string[]> {
    const words = await AsyncStorage.getItem(LEARNED_WORDS_KEY);
    return words ? JSON.parse(words) : [];
  },

  async addLearnedWord(word: string): Promise<void> {
    const words = await this.getLearnedWords();
    if (!words.includes(word)) {
      const newWords = [...words, word];
      await AsyncStorage.setItem(LEARNED_WORDS_KEY, JSON.stringify(newWords));
    }
  },
}; 