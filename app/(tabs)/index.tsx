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
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';
import { Colors } from '../../constants/theme';
import { useMenu } from '../../context/MenuContext';
import { ReportService } from '../../services/ReportService';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Storage } from '../../utils/storage';
import { Config } from '../../constants/Config';

const { width } = Dimensions.get('window');

// 1. Premium Mini Stat Card (Clean White Theme)
const MiniStatCard = ({ title, value, icon }: any) => {
    return (
        <View style={styles.miniStatCard}>
            <View style={[styles.miniStatIconBox, { backgroundColor: '#E6F0FF' }]}>
                <Ionicons name={icon} size={20} color="#0066FF" />
            </View>
            <View>
                <Text style={styles.miniStatValue}>{value}</Text>
                <Text style={styles.miniStatTitle}>{title}</Text>
            </View>
        </View>
    );
};

// 2. Horizontal Scroll Notification Card
const NotificationCard = ({ title, items, icon, accentColor }: any) => {
    return (
        <View style={styles.notificationCard}>
            <View style={styles.notifHeader}>
                <View style={[styles.notifIconCircle, { backgroundColor: accentColor + '15' }]}>
                    <Ionicons name={icon} size={18} color={accentColor} />
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

// 3. Analytics Card
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
        const [enqRes, eventRes, crewRes, plRes] = await Promise.all([
            ReportService.getEnquiryReports().catch(() => ({ data: [] })),
            ReportService.getEventReports().catch(() => ({ data: [] })),
            ReportService.getCrewReports().catch(() => ({ data: { crews: [] } })),
            ReportService.getProfitLossReports().catch(() => ({ data: [] }))
        ]);

        const enquiries = enqRes.data || enqRes || [];
        const bookings = eventRes.data || eventRes || [];
        const crews = crewRes.crews || (crewRes.data && crewRes.data.crews) || [];
        const plData = plRes.data || plRes || [];

        const totalIncome = Array.isArray(plData) ? plData.reduce((acc: number, item: any) => acc + (parseFloat(item.income) || 0), 0) : 0;
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
    router.replace('/(auth)');
  };

  const todaysBirthdays = ['Rahul Sharma', 'Priya Singh'];
  const todaysAnniversaries = ['Varma Couple (5th Yr)'];
  const todaysEvents = ['Sharma Wedding - Haldi', 'Corporate Gala Dinner'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header with more spacing */}
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
             <View style={[styles.statsGrid, { justifyContent: 'center', minHeight: 120 }]}>
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

        <Text style={[styles.sectionHeader, { color: theme.text, marginTop: 10 }]}>Quick Actions</Text>
        <Animated.View entering={FadeInRight.delay(150).duration(600)} style={styles.quickActionsRow}>
            <TouchableOpacity 
                style={[styles.actionCard, { backgroundColor: '#E0EBFF' }]} 
                onPress={() => router.push('/add-enquiry')}
            >
                <View style={[styles.actionIconBox, { backgroundColor: '#0066FF' }]}>
                    <Ionicons name="add" size={24} color="#FFF" />
                </View>
                <Text style={styles.actionText}>Add Enquiry</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={[styles.actionCard, { backgroundColor: '#F0FDF4' }]} 
                onPress={() => router.push('/crew-report')}
            >
                <View style={[styles.actionIconBox, { backgroundColor: '#166534' }]}>
                    <Ionicons name="people" size={24} color="#FFF" />
                </View>
                <Text style={styles.actionText}>Crew Reports</Text>
            </TouchableOpacity>
        </Animated.View>

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
            <AnalyticsCard title="Crew Demographics" icon="people" data={[
                { label: 'Photographer', value: 45, color: '#0066FF' },
                { label: 'Assistant', value: 30, color: '#4facfe' },
                { label: 'Editor', value: 25, color: '#00D4FF' },
            ]} />
            <AnalyticsCard title="City Dominance" icon="business" data={[
                { label: 'Mumbai', value: 210, color: '#0066FF' },
                { label: 'Pune', value: 150, color: '#4facfe' },
                { label: 'Delhi', value: 110, color: '#00D4FF' },
            ]} />
        </Animated.View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'ios' ? 70 : 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 25 },
  greeting: { color: '#94A3B8', fontSize: 13 },
  userName: { fontSize: 24, fontWeight: 'bold' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  menuBtn: { marginRight: 15, padding: 5 },
  profileBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 30 },
  sectionHeader: { fontSize: 20, fontWeight: '800', marginHorizontal: 20, marginTop: 15, marginBottom: 15 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between', marginBottom: 10 },
  miniStatCard: { 
    width: (width - 45) / 2, 
    flexDirection: 'column',
    padding: 20, 
    borderRadius: 24, 
    marginBottom: 15, 
    backgroundColor: '#F8FAFC', 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOpacity: 0.04, 
    shadowRadius: 5, 
    borderWidth: 1, 
    borderColor: '#E2E8F0' 
  },
  miniStatIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  miniStatValue: { color: '#0F172A', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  miniStatTitle: { color: '#64748B', fontSize: 13, fontWeight: '600' },
  horizontalScroll: { paddingHorizontal: 20, paddingBottom: 10 },
  notificationCard: { width: width * 0.8, backgroundColor: '#F8FAFC', borderRadius: 24, padding: 22, marginRight: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5, borderWidth: 1, borderColor: '#E2E8F0' },
  notifHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  notifIconCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  notifTitle: { color: '#011F41', fontSize: 17, fontWeight: 'bold' },
  notifBody: { minHeight: 60 },
  notifItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  notifDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  notifText: { color: '#475569', fontSize: 15, flex: 1 },
  emptyText: { color: '#94A3B8', fontStyle: 'italic', fontSize: 13 },
  analyticsCard: { marginHorizontal: 20, backgroundColor: '#F8FAFC', borderRadius: 24, padding: 24, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5, borderWidth: 1, borderColor: '#E2E8F0' },
  analyticsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 15 },
  analyticsTitle: { color: '#0F172A', fontSize: 17, fontWeight: 'bold' },
  analyticsBody: { marginTop: 5 },
  barContainer: { marginBottom: 18 },
  barLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  barLabel: { color: '#64748B', fontSize: 14, fontWeight: '500' },
  barValue: { color: '#0F172A', fontSize: 15, fontWeight: 'bold' },
  barBackground: { height: 8, borderRadius: 4, backgroundColor: '#F1F5F9', width: '100%', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  dropOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: Platform.OS === 'ios' ? 100 : 80, paddingRight: 15 },
  dropCard: { borderRadius: 24, padding: 24, width: 280, elevation: 25, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20 },
  dropUserInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  dropAvatar: { width: 54, height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center' },
  dropName: { fontSize: 18, fontWeight: 'bold' },
  dropEmail: { color: '#64748B', fontSize: 13, marginTop: 4 },
  dropDivider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 18 },
  dropLogout: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 15, backgroundColor: '#FEF2F2', borderRadius: 14 },
  dropLogoutText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold', marginLeft: 12 },
  quickActionsRow: { flexDirection: 'row', paddingHorizontal: 15, marginBottom: 10, gap: 12 },
  actionCard: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#E2E8F0',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 2,
  },
  actionIconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  actionText: { fontSize: 14, fontWeight: 'bold', color: '#0F172A' },
});
