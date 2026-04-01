import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { useMenu } from '../../context/MenuContext';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Storage } from '../../utils/storage';

const { width } = Dimensions.get('window');
const API_BASE_URL = 'http://10.64.185.100:8000/api';

// 1. Premium Mini Stat Card (Gold/Dark Theme)
const MiniStatCard = ({ title, value, icon, gradient }: any) => {
    return (
        <LinearGradient 
            colors={gradient || ['rgba(212, 175, 55, 0.15)', 'rgba(212, 175, 55, 0.05)']} 
            style={styles.miniStatCard}
            start={{x: 0, y: 0}} end={{x: 1, y: 1}}
        >
            <View style={styles.miniStatIconBox}>
                <Ionicons name={icon} size={18} color="#D4AF37" />
            </View>
            <Text style={styles.miniStatValue}>{value}</Text>
            <Text style={styles.miniStatTitle}>{title}</Text>
        </LinearGradient>
    );
};

// 2. Horizontal Scroll Notification Card (Glassmorphic)
const NotificationCard = ({ title, items, icon, accentColor }: any) => {
    return (
        <View style={styles.notificationCard}>
            <View style={styles.notifHeader}>
                <View style={[styles.notifIconCircle, { backgroundColor: accentColor + '20' }]}>
                    <Ionicons name={icon} size={16} color={accentColor} />
                </View>
                <Text style={styles.notifTitle}>{title}</Text>
            </View>
            <View style={styles.notifBody}>
                {items.length > 0 ? items.map((item: any, idx: number) => (
                    <View key={idx} style={styles.notifItem}>
                        <View style={[styles.notifDot, { backgroundColor: accentColor }]} />
                        <Text style={styles.notifText} numberOfLines={2}>{item}</Text>
                    </View>
                )) : (
                    <Text style={styles.emptyText}>Nothing scheduled for today.</Text>
                )}
            </View>
        </View>
    );
}

// 3. Sleek Analytics Bar Segment
const AnalyticsCard = ({ title, icon, data }: any) => {
    const maxVal = Math.max(...data.map((d: any) => d.value));

    return (
        <View style={styles.analyticsCard}>
            <View style={styles.analyticsHeader}>
                <Ionicons name={icon} size={20} color="#D4AF37" style={{ marginRight: 10 }} />
                <Text style={styles.analyticsTitle}>{title}</Text>
            </View>
            <View style={styles.analyticsBody}>
                {data.map((item: any, index: number) => (
                <View key={index} style={styles.barContainer}>
                    <View style={styles.barLabelRow}>
                        <Text style={styles.barLabel}>{item.label}</Text>
                        <Text style={styles.barValue}>{item.value}</Text>
                    </View>
                    <View style={styles.barBackground}>
                        <Animated.View style={[
                            styles.barFill, 
                            { width: `${(item.value / maxVal) * 100}%`, backgroundColor: item.color || '#D4AF37' }
                        ]} />
                    </View>
                </View>
                ))}
            </View>
        </View>
    );
}

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const { openMenu } = useMenu();
  const router = useRouter();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    Storage.getItem('userData').then(data => {
      if (data) setUserData(JSON.parse(data));
    });
  }, []);

  const handleLogout = async () => {
    setProfileDropdown(false);
    await Storage.clear(); // clear immediately so no stale state
    try {
      const token = await Storage.getItem('userToken');
      if (token) {
        axios.post(`${API_BASE_URL}/user/logout`, {}, {
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
        }).catch(() => {}); // fire-and-forget
      }
    } catch (e) {}
    // Reset entire navigation stack to login page
    router.dismissAll();
    router.replace('/(auth)');
  };

  // --- MOCK DATA ---
  const crewTypeData = [
    { label: 'Photographer', value: 45, color: '#4facfe' },
    { label: 'Assistant', value: 30, color: '#00f2fe' },
    { label: 'Editor', value: 25, color: '#a8edea' },
  ];

  const cityBookingData = [
    { label: 'Mumbai', value: 210, color: '#ff9a9e' },
    { label: 'Pune', value: 150, color: '#fecfef' },
    { label: 'Delhi', value: 110, color: '#f5576c' },
  ];

  const paymentData = [
    { label: 'Total Revenue', value: 500000, color: '#4CAF50' },
    { label: 'Advance', value: 250000, color: '#8BC34A' },
    { label: 'Balance', value: 200000, color: '#FFC107' },
  ];

  const todaysBirthdays = [
    'Rahul Sharma (28th) - CUST-101',
    'Priya Singh (25th) - CUST-304'
  ];

  const todaysAnniversaries = [
    'Varma Couple (5th) - CUST-223'
  ];

  const todaysEvents = [
    'Sharma Wedding - Haldi (EVT-892)',
    'Corporate Gala Dinner (EVT-931)'
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={openMenu} style={styles.menuBtn}>
            <Ionicons name="menu" size={28} color={theme.text} />
          </TouchableOpacity>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={[styles.userName, { color: theme.text }]}>{userData?.name || 'Admin'}</Text>
          </View>
        </View>

        {/* Profile Button */}
        <TouchableOpacity style={styles.profileBtn} onPress={() => setProfileDropdown(true)}>
          <Ionicons name="person" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Profile Dropdown Modal */}
      <Modal
        visible={profileDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setProfileDropdown(false)}
      >
        <TouchableOpacity style={styles.dropOverlay} activeOpacity={1} onPress={() => setProfileDropdown(false)}>
          <View style={styles.dropCard}>
            {/* User Info */}
            <View style={styles.dropUserInfo}>
              <View style={styles.dropAvatar}>
                <Ionicons name="person" size={28} color="#000040" />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.dropName}>{userData?.name || 'Admin'}</Text>
                <Text style={styles.dropEmail} numberOfLines={1}>{userData?.email || ''}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>{userData?.role?.toUpperCase() || 'USER'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.dropDivider} />

            {/* Logout */}
            <TouchableOpacity style={styles.dropLogout} onPress={handleLogout}>
              <Ionicons name="log-out" size={20} color="#FF4B4B" />
              <Text style={styles.dropLogoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* STATS OVERVIEW - Masonry style grid */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.statsGrid}>
            <MiniStatCard title="Total Enquiries" value="1,284" icon="mail-unread" />
            <MiniStatCard title="Active Bookings" value="142" icon="calendar" />
            <MiniStatCard title="Revenue (M)" value="₹ 4.2 L" icon="wallet" />
            <MiniStatCard title="Pending Tasks" value="18" icon="list" />
        </Animated.View>

        <Text style={styles.sectionHeader}>Today's Highlights</Text>

        {/* HORIZONTAL NOTIFICATIONS - Clean and modern */}
        <Animated.View entering={FadeInRight.delay(200).duration(700)}>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.horizontalScroll}
                snapToInterval={width * 0.75 + 15}
                decelerationRate="fast"
            >
                <NotificationCard 
                    title="Events Today" 
                    icon="calendar" 
                    accentColor="#4facfe" 
                    items={todaysEvents} 
                />
                <NotificationCard 
                    title="Birthdays" 
                    icon="gift" 
                    accentColor="#FF6B6B" 
                    items={todaysBirthdays} 
                />
                <NotificationCard 
                    title="Anniversaries" 
                    icon="heart" 
                    accentColor="#FF69B4" 
                    items={todaysAnniversaries} 
                />
            </ScrollView>
        </Animated.View>

        <Text style={[styles.sectionHeader, { marginTop: 30 }]}>Analytics Hub</Text>

        {/* ANALYTICS VERTICAL STACK - Deep dark theme mapping */}
        <Animated.View entering={FadeInUp.delay(300).duration(800)}>
            <AnalyticsCard 
                title="Crew Demographics" 
                icon="people" 
                data={crewTypeData} 
            />
            <AnalyticsCard 
                title="City Dominance" 
                icon="business" 
                data={cityBookingData} 
            />
            <AnalyticsCard 
                title="Financial Distribution" 
                icon="cash" 
                data={paymentData} 
            />
        </Animated.View>

        <View style={{ height: 40 }} />
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
    marginBottom: 20,
  },
  greeting: {
    color: '#aaa',
    fontSize: 13,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuBtn: {
    marginRight: 15,
  },
  profileBtn: {
      width: 40, 
      height: 40, 
      borderRadius: 20, 
      backgroundColor: '#D4AF37',
      justifyContent: 'center',
      alignItems: 'center'
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold',
      marginHorizontal: 20,
      marginTop: 10,
      marginBottom: 15,
      letterSpacing: 0.5,
  },
  statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 15,
      justifyContent: 'space-between',
      marginBottom: 15,
  },
  miniStatCard: {
      width: (width - 45) / 2, // 2 columns
      padding: 16,
      borderRadius: 16,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  miniStatIconBox: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: 'rgba(212, 175, 55, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
  },
  miniStatValue: {
      color: '#FFF',
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 4,
  },
  miniStatTitle: {
      color: '#aaa',
      fontSize: 12,
      fontWeight: '600',
  },
  horizontalScroll: {
      paddingHorizontal: 20,
      gap: 15,
  },
  notificationCard: {
      width: width * 0.75, // Swipable cards
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: 20,
      padding: 18,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
  },
  notifHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
  },
  notifIconCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
  },
  notifTitle: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
  },
  notifBody: {
      minHeight: 80,
  },
  notifItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 10,
  },
  notifDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginTop: 6,
      marginRight: 10,
  },
  notifText: {
      color: '#E0E0E0',
      fontSize: 14,
      flex: 1,
      lineHeight: 20,
  },
  emptyText: {
      color: '#777',
      fontStyle: 'italic',
      fontSize: 13,
  },
  analyticsCard: {
      marginHorizontal: 20,
      backgroundColor: 'rgba(255,255,255,0.02)',
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.08)',
  },
  analyticsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
      paddingBottom: 15,
  },
  analyticsTitle: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
      letterSpacing: 0.5,
  },
  analyticsBody: {
      marginTop: 5,
  },
  barContainer: {
      marginBottom: 16,
  },
  barLabelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
  },
  barLabel: {
      color: '#ccc',
      fontSize: 13,
      fontWeight: '500',
  },
  barValue: {
      color: '#FFF',
      fontSize: 14,
      fontWeight: 'bold',
  },
  barBackground: {
      height: 6,
      borderRadius: 3,
      backgroundColor: 'rgba(255,255,255,0.06)',
      width: '100%',
      overflow: 'hidden',
  },
  barFill: {
      height: '100%',
      borderRadius: 3,
  },
  // --- Profile Dropdown Styles ---
  dropOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingRight: 15,
  },
  dropCard: {
    backgroundColor: '#0A0A40',
    borderRadius: 16,
    padding: 18,
    width: 240,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 15,
  },
  dropUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  dropAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropEmail: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
  roleBadge: {
    marginTop: 5,
    backgroundColor: 'rgba(212,175,55,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.4)',
  },
  roleText: {
    color: '#D4AF37',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  dropDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 14,
  },
  dropLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255,75,75,0.08)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,75,75,0.3)',
  },
  dropLogoutText: {
    color: '#FF4B4B',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 12,
  },
});
