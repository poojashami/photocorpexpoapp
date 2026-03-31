import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.text }]}>Explore Services</Text>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardText, { color: theme.text }]}>Photography Portfolio</Text>
        </View>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardText, { color: theme.text }]}>Videography Samples</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
