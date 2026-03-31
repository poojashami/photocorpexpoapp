import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';

const { width } = Dimensions.get('window');

const dummyEnquiries = [
  { id: '1', name: 'Rahul Malhotra', source: 'Facebook', status: 'New', date: '21 Mar, 10:30 AM', message: 'Interested in wedding photography package' },
  { id: '2', name: 'Simran Kaur', source: 'Instagram', status: 'Contacted', date: '20 Mar, 02:15 PM', message: 'Pre-wedding shoot in Goa enquiry' },
  { id: '3', name: 'Vivek Gupta', source: 'Website', status: 'Hot', date: '19 Mar, 11:00 AM', message: 'Corporate event for next month' },
  { id: '4', name: 'Ishita Rawat', source: 'Referral', status: 'Closed', date: '18 Mar, 05:45 PM', message: 'Maternity shoot booking' },
  { id: '5', name: 'Pooja Singh', source: 'WhatsApp', status: 'New', date: '17 Mar, 09:20 AM', message: 'Birthday party photoshoot' },
];

export default function EnquiriesScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const [search, setSearch] = useState('');

  const renderEnquiryItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeInRight.delay(index * 100).duration(500)}>
      <TouchableOpacity style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <View style={styles.nameContainer}>
            <View style={[styles.avatar, { backgroundColor: theme.tint }]}>
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
            <View style={styles.nameInfo}>
              <Text style={[styles.clientName, { color: theme.text }]}>{item.name}</Text>
              <Text style={styles.sourceText}>via {item.source}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
          </View>
        </View>
        
        <Text style={[styles.message, { color: theme.text }]} numberOfLines={2}>{item.message}</Text>
        
        <View style={styles.cardFooter}>
          <Ionicons name="time-outline" size={14} color="#888" />
          <Text style={styles.dateText}>{item.date}</Text>
          <TouchableOpacity style={styles.actionBtn}>
             <Ionicons name="call-outline" size={18} color={theme.tint} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'New': return { backgroundColor: 'rgba(74, 144, 226, 0.1)' };
      case 'Hot': return { backgroundColor: 'rgba(255, 75, 75, 0.1)' };
      case 'Contacted': return { backgroundColor: 'rgba(212, 175, 55, 0.1)' };
      default: return { backgroundColor: 'rgba(136, 136, 136, 0.1)' };
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'New': return '#4A90E2';
      case 'Hot': return '#FF4B4B';
      case 'Contacted': return '#D4AF37';
      default: return '#888';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Enquiries</Text>
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.tint }]}>
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Ionicons name="search-outline" size={20} color="#888" />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search enquiries..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={dummyEnquiries}
        keyExtractor={(item) => item.id}
        renderItem={renderEnquiryItem}
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
    elevation: 4,
    shadowColor: '#D4AF37',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    padding: 18,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nameInfo: {
    marginLeft: 12,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sourceText: {
    fontSize: 12,
    color: '#888',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 5,
    flex: 1,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
});
