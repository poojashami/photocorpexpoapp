import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

const dummyPeople = [
  { id: '1', name: 'John Doe', role: 'Lead Photographer', email: 'john@photocorp.in', phone: '9876543210', type: 'Crew' },
  { id: '2', name: 'Alice Smith', role: 'Editor', email: 'alice@photocorp.in', phone: '9876543211', type: 'Crew' },
  { id: '3', name: 'Bob Johnson', role: 'Videographer', email: 'bob@photocorp.in', phone: '9876543212', type: 'Crew' },
  { id: '4', name: 'Client 1', role: 'Premium Client', email: 'client1@gmail.com', phone: '9876543213', type: 'Customer' },
];

export default function PeopleScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const [activeTab, setActiveTab] = useState('Crew');

  const filteredData = dummyPeople.filter(p => p.type === activeTab);

  const renderPersonCard = ({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
      <TouchableOpacity style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={[styles.avatar, { backgroundColor: item.type === 'Crew' ? 'rgba(212, 175, 55, 0.1)' : 'rgba(74, 144, 226, 0.1)' }]}>
          <Ionicons name={item.type === 'Crew' ? "camera" : "person"} size={24} color={item.type === 'Crew' ? theme.tint : '#4A90E2'} />
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
          <Text style={styles.role}>{item.role}</Text>
          <View style={styles.contactRow}>
            <Ionicons name="call-outline" size={14} color="#888" />
            <Text style={styles.contactText}>{item.phone}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Directory</Text>
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.tint }]}>
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {['Crew', 'Customer'].map((tab) => (
          <TouchableOpacity 
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab, 
              activeTab === tab && { borderBottomColor: theme.tint, borderBottomWidth: 3 }
            ]}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === tab ? theme.tint : '#888' }
            ]}>{tab}s</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderPersonCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  tab: {
    paddingVertical: 10,
    marginRight: 25,
    paddingHorizontal: 5,
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 18,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  contactText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 5,
  },
  actionBtn: {
    padding: 10,
  },
});
