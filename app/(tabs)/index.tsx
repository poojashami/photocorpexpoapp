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
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { useMenu } from '../../context/MenuContext';
import { ReportService } from '../../services/ReportService';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Storage } from '../../utils/storage';
import { Config } from '../../constants/Config';

const { width } = Dimensions.get('window');
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// 1. Premium Mini Stat Card (Soft Blue Light Theme)
const MiniStatCard = ({ title, value, icon, gradient }: any) => {
    return (
        <View style={styles.miniStatCard}>
            <View style={[styles.miniStatIconBox, { backgroundColor: '#E6F0FF' }]}>
                <Ionicons name={icon} size={18} color="#0066FF" />
            </View>
            <Text style={styles.miniStatValue}>{value}</Text>
            <Text style={styles.miniStatTitle}>{title}</Text>
        </View>
    );
};

// 2. Horizontal Scroll Notification Card (Light Glass/Bordered)
const NotificationCard = ({ title, items, icon, accentColor }: any) => {
    return (
        <View style={styles.notificationCard}>
            <View style={styles.notifHeader}>
                <View style={[styles.notifIconCircle, { backgroundColor: accentColor + '15' }]}>
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

// 3. Sleek Analytics Bar Segment (Clean White)
const AnalyticsCard = ({ title, icon, data }: any) => {
    const maxVal = data.length > 0 ? Math.max(...data.map((d: any) => d.value)) : 100;

    return (
        <View style={styles.analyticsCard}>
            <View style={styles.analyticsHeader}>
                <Ionicons name={icon} size={20} color="#0066FF" style={{ marginRight: 10 }} />
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
                            { width: `${(item.value / maxVal) * 100}%`, backgroundColor: item.color || '#0066FF' }
                        ]} />
                    </View>
                </View>
                ))}
            </View>
        </View>
    );
}

export default function DashboardScreen() {
  const colorScheme = 'light'; // Forcing light theme context
  const theme = Colors.light;
  const { openMenu } = useMenu();
  const router = useRouter();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [dashboardStats, setDashboardStats] = useState({
    enquiries: '0',
    bookings: '0',
    revenue: '₹ 0',
    crews: '0'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Storage.getItem('userData').then(data => {
      if (data) setUserData(JSON.parse(data));
    });
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
        // Fetching counts from existing report APIs to make dashboard dynamic
        const [enqRes, eventRes, crewRes, plRes] = await Promise.all([
            ReportService.getEnquiryReports(),
            ReportService.getEventReports(),
            ReportService.getCrewReports(),
            ReportService.getProfitLossReports()
        ]);

        const enquiries = enqRes.data || enqRes;
        const bookings = eventRes.data || eventRes;
        const crews = crewRes.crews || crewRes.data?.crews || [];
        const plData = Array.isArray(plRes.data) ? plRes.data : (Array.isArray(plRes) ? plRes : []);

        // Calculate total income for revenue display
        const totalIncome = plData.reduce((acc: number, item: any) => acc + (parseFloat(item.income) || 0), 0);
        const revenueFormatted = totalIncome >= 100000 
            ? `₹ ${(totalIncome / 100000).toFixed(1)} L` 
            : `₹ ${totalIncome}`;

        setDashboardStats({
            enquiries: Array.isArray(enquiries) ? enquiries.length.toString() : '0',
            bookings: Array.isArray(bookings) ? bookings.length.toString() : '0',
            revenue: revenueFormatted,
            crews: Array.isArray(crews) ? crews.length.toString() : '0'
        });
    } catch (e) {
        console.error('Dash fetch error:', e);
    } finally {
        setLoading(false);
    }
  };

  const handleLogout = async () => {
    setProfileDropdown(false);
    await Storage.clear(); 
    try {
      const token = await Storage.getItem('userToken');
      if (token) {
        axios.post(`${Config.API_URL}/user/logout`, {}, {
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
        }).catch(() => {});
      }
    } catch (e) {}
    router.dismissAll();
    router.replace('/(auth)');
  };

  // --- MOCK DATA ---
  const crewTypeData = [
    { label: 'Photographer', value: 45, color: '#0066FF' },
    { label: 'Assistant', value: 30, color: '#4facfe' },
    { label: 'Editor', value: 25, color: '#00D4FF' },
  ];

  const cityBookingData = [
    { label: 'Mumbai', value: 210, color: '#0066FF' },
    { label: 'Pune', value: 150, color: '#4facfe' },
    { label: 'Delhi', value: 110, color: '#00D4FF' },
  ];

  const paymentData = [
    { label: 'Total Revenue', value: 500000, color: '#10B981' },
    { label: 'Advance', value: 250000, color: '#3B82F6' },
    { label: 'Balance', value: 200000, color: '#F59E0B' },
  ];

  const todaysBirthdays = ['Rahul Sharma', 'Priya Singh'];
  const todaysAnniversaries = ['Varma Couple (5th Yr)'];
  const todaysEvents = ['Sharma Wedding - Haldi', 'Corporate Gala Dinner'];

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
        <TouchableOpacity style={[styles.profileBtn, { backgroundColor: theme.tint }]} onPress={() => setProfileDropdown(true)}>
          <Ionicons name="person" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <Modal visible={profileDropdown} transparent animationType="fade">
        <TouchableOpacity style={styles.dropOverlay} activeOpacity={1} onPress={() => setProfileDropdown(false)}>
          <View style={[styles.dropCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.dropUserInfo}>
              <View style={[styles.dropAvatar, { backgroundColor: theme.tint }]}>
                <Ionicons name="person" size={28} color="#FFF" />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={[styles.dropName, { color: theme.text }]}>{userData?.name || 'Admin'}</Text>
                <Text style={styles.dropEmail} numberOfLines={1}>{userData?.email || ''}</Text>
              </View>
            </View>
            <View style={styles.dropDivider} />
            <TouchableOpacity style={styles.dropLogout} onPress={handleLogout}>
              <Ionicons name="log-out" size={20} color="#FF4B4B" />
              <Text style={styles.dropLogoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {loading ? (
             <View style={[styles.statsGrid, { justifyContent: 'center', paddingVertical: 20 }]}>
                <ActivityIndicator color={theme.tint} />
             </View>
        ) : (
            <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.statsGrid}>
                <MiniStatCard title="Total Enquiries" value={dashboardStats.enquiries} icon="mail-unread" />
                <MiniStatCard title="Active Bookings" value={dashboardStats.bookings} icon="calendar" />
                <MiniStatCard title="Revenue (M)" value={dashboardStats.revenue} icon="wallet" />
                <MiniStatCard title="Total Crews" value={dashboardStats.crews} icon="people" />
            </Animated.View>
        )}

        <Text style={[styles.sectionHeader, { color: theme.text }]}>Today's Highlights</Text>
        <Animated.View entering={FadeInRight.delay(200).duration(700)}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                <NotificationCard title="Events Today" icon="calendar" accentColor="#0066FF" items={todaysEvents} />
                <NotificationCard title="Birthdays" icon="gift" accentColor="#EE46BC" items={todaysBirthdays} />
                <NotificationCard title="Anniversaries" icon="heart" accentColor="#F43F5E" items={todaysAnniversaries} />
            </ScrollView>
        </Animated.View>

        <Text style={[styles.sectionHeader, { color: theme.text, marginTop: 30 }]}>Analytics Hub</Text>
        <Animated.View entering={FadeInUp.delay(300).duration(800)}>
            <AnalyticsCard title="Crew Demographics" icon="people" data={crewTypeData} />
            <AnalyticsCard title="City Dominance" icon="business" data={cityBookingData} />
            <AnalyticsCard title="Financial Distribution" icon="cash" data={paymentData} />
        </Animated.View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  greeting: { color: '#94A3B8', fontSize: 13 },
  userName: { fontSize: 22, fontWeight: 'bold' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  menuBtn: { marginRight: 15 },
  profileBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 20 },
  sectionHeader: { fontSize: 18, fontWeight: '700', marginHorizontal: 20, marginTop: 10, marginBottom: 15 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between', marginBottom: 15 },
  miniStatCard: { width: (width - 45) / 2, padding: 18, borderRadius: 20, marginBottom: 15, backgroundColor: '#FFF', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
  miniStatIconBox: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  miniStatValue: { color: '#0F172A', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  miniStatTitle: { color: '#64748B', fontSize: 12, fontWeight: '600' },
  horizontalScroll: { paddingHorizontal: 20, gap: 15 },
  notificationCard: { width: width * 0.75, backgroundColor: '#FFF', borderRadius: 20, padding: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, borderWidth: 1, borderColor: '#F1F5F9' },
  notifHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  notifIconCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  notifTitle: { color: '#0F172A', fontSize: 16, fontWeight: 'bold' },
  notifBody: { minHeight: 80 },
  notifItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  notifDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6, marginRight: 10 },
  notifText: { color: '#475569', fontSize: 14, flex: 1, lineHeight: 20 },
  emptyText: { color: '#94A3B8', fontStyle: 'italic', fontSize: 13 },
  analyticsCard: { marginHorizontal: 20, backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
  analyticsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 15 },
  analyticsTitle: { color: '#0F172A', fontSize: 16, fontWeight: 'bold' },
  analyticsBody: { marginTop: 5 },
  barContainer: { marginBottom: 16 },
  barLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  barLabel: { color: '#64748B', fontSize: 13, fontWeight: '500' },
  barValue: { color: '#0F172A', fontSize: 14, fontWeight: 'bold' },
  barBackground: { height: 6, borderRadius: 3, backgroundColor: '#F1F5F9', width: '100%', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  dropOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: Platform.OS === 'ios' ? 100 : 80, paddingRight: 15 },
  dropCard: { borderRadius: 20, padding: 20, width: 260, elevation: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 15 },
  dropUserInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  dropAvatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  dropName: { fontSize: 16, fontWeight: 'bold' },
  dropEmail: { color: '#64748B', fontSize: 12, marginTop: 2 },
  dropDivider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 16 },
  dropLogout: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, backgroundColor: '#FEF2F2', borderRadius: 12 },
  dropLogoutText: { color: '#EF4444', fontSize: 15, fontWeight: 'bold', marginLeft: 12 },
});

