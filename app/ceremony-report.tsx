import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Platform, 
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function CeremonyReportScreen() {
  const router = useRouter();
  
  // Hardcoded data for now
  const [reportData] = useState<any[]>([
    {
      startDate: '2025-10-15',
      startTime: '10:00 AM',
      ceremonyName: 'Haldi',
      eventId: 'EVT001',
      eventName: 'Rahul & Priya Wedding',
      customerId: 'CUST01',
      customerName: 'Rahul Sharma',
      customerPhone: '9876543210',
      eventFor: 'Groom',
      services: 'Photography, Videography',
      crewName: 'Abhishek',
      crewSkill: 'Photographer'
    },
    {
        startDate: '2025-10-15',
        startTime: '04:00 PM',
        ceremonyName: 'Mehendi',
        eventId: 'EVT001',
        eventName: 'Rahul & Priya Wedding',
        customerId: 'CUST01',
        customerName: 'Rahul Sharma',
        customerPhone: '9876543210',
        eventFor: 'Bride',
        services: 'Photography',
        crewName: 'Suresh',
        crewSkill: 'Assistant'
    }
  ]);

  const columns = [
    '#', 'Start Date', 'Start Time', 'Ceremony', 'Event ID', 'Event Name', 
    'Cust. ID', 'Cust. Name', 'Cust. Phone', 'Event For', 'Services', 
    'Crew Name', 'Crew Skill'
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crew Ceremony</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Total Ceremonies:</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{reportData.length}</Text>
          </View>
        </View>

        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolBtn}>
            <Ionicons name="download-outline" size={16} color="#0066FF" />
            <Text style={styles.toolText}>Export PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn}>
            <Ionicons name="filter-outline" size={16} color="#0066FF" />
            <Text style={styles.toolText}>Filters</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Table */}
      <View style={styles.tableWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ minWidth: '100%' }}>
            {/* Table Header */}
            <View style={styles.tableHeaderRow}>
              {columns.map((col, i) => (
                <View key={i} style={[
                    styles.tableCell, 
                    i === 0 && { width: 50 },
                    (col === 'Event Name' || col === 'Services') && { width: 200 },
                    col === 'Cust. Name' && { width: 150 },
                ]}>
                  <Text style={styles.headerText}>{col}</Text>
                </View>
              ))}
            </View>

            {/* Table Body */}
            <ScrollView>
              {reportData.map((row: any, i) => (
                <View key={i} style={[styles.tableRow, { backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }]}>
                  <Text style={[styles.tableCell, { width: 50, color: '#64748B' }]}>{i + 1}</Text>
                  <Text style={[styles.tableCell, { color: '#475569' }]}>{row.startDate}</Text>
                  <Text style={[styles.tableCell, { color: '#475569' }]}>{row.startTime}</Text>
                  <Text style={[styles.tableCell, { color: '#0F172A', fontWeight: '500' }]}>{row.ceremonyName}</Text>
                  <Text style={[styles.tableCell, { color: '#475569' }]}>{row.eventId}</Text>
                  <Text style={[styles.tableCell, { width: 200, color: '#475569' }]}>{row.eventName}</Text>
                  <Text style={[styles.tableCell, { color: '#475569' }]}>{row.customerId}</Text>
                  <Text style={[styles.tableCell, { width: 150, color: '#475569' }]}>{row.customerName}</Text>
                  <Text style={[styles.tableCell, { color: '#475569' }]}>{row.customerPhone}</Text>
                  <Text style={[styles.tableCell, { color: '#475569' }]}>{row.eventFor}</Text>
                  <Text style={[styles.tableCell, { width: 200, color: '#475569' }]}>{row.services}</Text>
                  <Text style={[styles.tableCell, { color: '#475569' }]}>{row.crewName}</Text>
                  <Text style={[styles.tableCell, { color: '#475569' }]}>{row.crewSkill}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 15, backgroundColor: '#FFFFFF' },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  backBtn: { padding: 5, marginLeft: -10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  statsLabel: { fontSize: 13, fontWeight: '600', color: '#64748B', marginRight: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 6, backgroundColor: '#0066FF' },
  badgeText: { fontWeight: 'bold', fontSize: 13, color: '#FFFFFF' },
  toolbar: { flexDirection: 'row', gap: 10 },
  toolBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderRadius: 10, borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
  toolText: { marginLeft: 6, fontSize: 12, fontWeight: '600', color: '#0066FF' },
  tableWrapper: { flex: 1, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#0066FF' },
  tableCell: { width: 120, padding: 15, justifyContent: 'center' },
  headerText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
});
