import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';

const { width } = Dimensions.get('window');

const dummyBookings = [
  { id: '1', title: 'Grand Royal Wedding', client: 'Malhotra family', date: '25 Oct, 2025', time: '04:00 PM', location: 'The Oberoi, Delhi', icon: 'heart', color: '#FF708D' },
  { id: '2', title: 'Corporate Annual Meet', client: 'Tech Corp Inc.', date: '12 Nov, 2025', time: '10:00 AM', location: 'JW Marriott', icon: 'business', color: '#4A90E2' },
  { id: '3', title: 'Outdoor Pre-Wedding', client: 'Aryan & Ishita', date: '15 Nov, 2025', time: '05:30 AM', location: 'Lodhi Garden', icon: 'camera', color: '#D4AF37' },
  { id: '4', title: '1st Birthday Bash', client: 'Aarav Gupta', date: '05 Dec, 2025', time: '06:00 PM', location: 'Home Studio', icon: 'balloon', color: '#4CAF50' },
];

export default function ScheduleScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];

  const renderBookingCard = ({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 150).duration(600)}>
      <TouchableOpacity style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateDay}>{item.date.split(' ')[0]}</Text>
          <Text style={styles.dateMonth}>{item.date.split(' ')[1].replace(',', '')}</Text>
        </View>
        
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
          <Text style={styles.client}>{item.client}</Text>
          
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={14} color={theme.tint} />
              <Text style={[styles.detailText, { color: theme.text }]}>{item.time}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={14} color={theme.tint} />
              <Text style={[styles.detailText, { color: theme.text }]} numberOfLines={1}>{item.location}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.typeIcon, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon as any} size={20} color={item.color} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Schedule</Text>
          <Text style={styles.subTitle}>Manage your upcoming shoots</Text>
        </View>
        <TouchableOpacity style={styles.calendarToggle}>
          <Ionicons name="calendar-outline" size={24} color={theme.tint} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={dummyBookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBookingCard}
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
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subTitle: {
    color: '#888',
    fontSize: 14,
  },
  calendarToggle: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    alignItems: 'center',
  },
  dateBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    width: 55,
    height: 65,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  dateDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  dateMonth: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  client: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 5,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
