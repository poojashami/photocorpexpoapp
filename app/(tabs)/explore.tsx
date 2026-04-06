import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

export default function ExploreScreen() {
  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <Text style={styles.text}>Explore Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
});
