import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];

const stats: { id: number; label: string; value: string; icon: any; color: [string, string] }[] = [
    { id: 1, label: 'Enquiries', value: '24', icon: 'mail-outline', color: ['#D4AF37', '#B5942B'] },
    { id: 2, label: 'Bookings', value: '12', icon: 'calendar-outline', color: ['#4A90E2', '#357ABD'] },
    { id: 3, label: 'Revenue', value: '₹4.2L', icon: 'cash-outline', color: ['#4CAF50', '#388E3C'] },
  ];

  const recentEvents = [
    { id: 1, type: 'Wedding', client: 'Sharma Wedding', date: '25 Oct, 2025', status: 'Upcoming' },
    { id: 2, type: 'Pre-Wedding', client: 'Aryan & Ishita', date: '12 Nov, 2025', status: 'Pending' },
    { id: 3, type: 'Event', client: 'Corporate Gala', date: '05 Dec, 2025', status: 'Confirmed' },
    { id: 4, type: 'Birthday', client: 'Aarav 1st BDay', date: '15 Dec, 2025', status: 'Upcoming' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.userName}>PhotoCorp Admin</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={24} color={theme.text} />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <Animated.View 
              key={stat.id}
              entering={FadeInRight.delay(index * 100).duration(800)}
            >
              <TouchableOpacity>
                <LinearGradient colors={stat.color} style={styles.statCard}>
                  <Ionicons name={stat.icon} size={24} color="#000" />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Action Grid */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.card }]}>
            <Ionicons name="person-add-outline" size={24} color={theme.tint} />
            <Text style={[styles.actionText, { color: theme.text }]}>Add Client</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.card }]}>
            <Ionicons name="create-outline" size={24} color={theme.tint} />
            <Text style={[styles.actionText, { color: theme.text }]}>New Enquiry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.card }]}>
            <Ionicons name="images-outline" size={24} color={theme.tint} />
            <Text style={[styles.actionText, { color: theme.text }]}>Portfolio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.card }]}>
            <Ionicons name="settings-outline" size={24} color={theme.tint} />
            <Text style={[styles.actionText, { color: theme.text }]}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Events */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Events</Text>
          <TouchableOpacity>
            <Text style={{ color: theme.tint }}>View All</Text>
          </TouchableOpacity>
        </View>

        {recentEvents.map((event, index) => (
          <Animated.View 
            key={event.id}
            entering={FadeInDown.delay(index * 150 + 400).duration(800)}
          >
            <TouchableOpacity style={[styles.eventCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.eventTypeIcon, { backgroundColor: 'rgba(212, 175, 55, 0.1)' }]}>
                <Ionicons name="camera" size={20} color={theme.tint} />
              </View>
              <View style={styles.eventInfo}>
                <Text style={[styles.eventClient, { color: theme.text }]}>{event.client}</Text>
                <Text style={styles.eventType}>{event.type} • {event.date}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: event.status === 'Upcoming' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(212, 175, 55, 0.1)' }]}>
                <Text style={[styles.statusText, { color: event.status === 'Upcoming' ? '#4CAF50' : '#D4AF37' }]}>{event.status}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
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
  greeting: {
    color: '#888',
    fontSize: 14,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  notificationBtn: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4B4B',
    borderWidth: 1.5,
    borderColor: '#0F0F0F',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 25,
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 3,
    padding: 15,
    borderRadius: 20,
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  actionBtn: {
    width: (width - 50) / 2,
    margin: 5,
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
  },
  actionText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
    marginBottom: 10,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
  },
  eventTypeIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventInfo: {
    flex: 1,
    marginLeft: 15,
  },
  eventClient: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventType: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
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
});
