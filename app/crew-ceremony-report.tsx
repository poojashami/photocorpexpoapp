import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Platform, 
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ReportService } from '../services/ReportService';

const { width } = Dimensions.get('window');

export default function CrewCeremonyReportScreen() {
  const router = useRouter();
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await ReportService.getCrewCeremonyReports();
      const data = response.data || response;
      setReportData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = ['#', 'Ceremony ID', 'Ceremony Name', 'Booking Count'];

  return (
    <View style={styles.container}>
      {/* Header section with back button and basic info */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ceremony Reports</Text>
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

      {/* Main Data Table */}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0066FF" />
          <Text style={styles.loaderText}>Loading Ceremonies...</Text>
        </View>
      ) : (
        <View style={styles.tableWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ minWidth: '100%' }}>
                <View style={styles.tableHeaderRow}>
                    {columns.map((col, i) => (
                        <View key={i} style={[styles.tableCell, i === 0 && { width: 60 }]}><Text style={styles.headerText}>{col}</Text></View>
                    ))}
                </View>
                <ScrollView>
                    {reportData.map((row: any, i) => (
                        <View key={i} style={[styles.tableRow, { backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }]}>
                            <Text style={[styles.tableCell, { width: 60, color: '#64748B' }]}>{i + 1}</Text>
                            <Text style={[styles.tableCell, { color: '#475569' }]}>{row.ceremony_name || '-'}</Text>
                            <Text style={[styles.tableCell, { color: '#0F172A', fontWeight: '500' }]}>{row.name || '-'}</Text>
                            <Text style={[styles.tableCell, { color: '#0066FF', fontWeight: 'bold' }]}>{row.count ?? '0'}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
          </ScrollView>
        </View>
      )}
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
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { color: '#64748B', marginTop: 10 },
  tableWrapper: { flex: 1, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#0066FF' },
  tableCell: { width: 140, padding: 15, justifyContent: 'center' },
  headerText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
});
