/**
 * Cross-platform storage utility.
 * Uses AsyncStorage on native (iOS/Android) and localStorage on web.
 */
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Storage = {
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },

  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  },

  async clear(): Promise<void> {
    const keys = ['userToken', 'userData', 'companyId', 'menuIds'];
    if (Platform.OS === 'web') {
      keys.forEach(k => localStorage.removeItem(k));
    } else {
      await AsyncStorage.multiRemove(keys);
    }
  },
};
