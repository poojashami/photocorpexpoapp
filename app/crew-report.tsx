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

export default function CrewReportScreen() {
  const router = useRouter();
  const [reportData, setReportData] = useState<any[]>([]);
  const [skillsMap, setSkillsMap] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await ReportService.getCrewReports();
      const data = response.data || response;
      const crews = Array.isArray(data.crews) ? data.crews : [];
      const skills = Array.isArray(data.crew_skills) ? data.crew_skills : [];
      
      const sMap: any = {};
      skills.forEach((s: any) => {
        sMap[s.id] = s.skill_name;
      });
      
      setSkillsMap(sMap);
      setReportData(crews);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSkillNames = (skillIds: string | undefined) => {
    if (!skillIds) return '-';
    const ids = skillIds.split(',').filter(id => id.trim() !== '');
    return ids.map(id => skillsMap[id] || id).join(', ');
  };

  const columns = ['#', 'Actions', 'Crew ID', 'Name', 'Phone', 'Email', 'Skills', 'Type', 'Salary', 'Address', 'Status'];

  return (
    <View style={styles.container}>
      {/* Premium White Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crew Reports</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Total Studio Crew:</Text>
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
          <Text style={styles.loaderText}>Fetching Crew Data...</Text>
        </View>
      ) : (
        <View style={styles.tableWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ minWidth: '100%' }}>
                {/* Table Header - Blue with White Text */}
                <View style={styles.tableHeaderRow}>
                    {columns.map((col, index) => (
                        <View key={index} style={[
                            styles.tableCell, 
                            index === 0 && { width: 50 },
                            col === 'Actions' && { width: 80 },
                            col === 'Crew ID' && { width: 100 },
                            col === 'Name' && { width: 150 },
                            col === 'Phone' && { width: 120 },
                            col === 'Email' && { width: 180 },
                            col === 'Skills' && { width: 200 },
                            col === 'Type' && { width: 120 },
                            col === 'Salary' && { width: 100 },
                            col === 'Address' && { width: 250 },
                            col === 'Status' && { width: 100 },
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
                            <View style={[styles.tableCell, { width: 80, flexDirection: 'row', gap: 10 }]}>
                                <TouchableOpacity onPress={() => router.push({ pathname: '/crew-event-report', params: { id: row.id } })}>
                                    <Ionicons name="eye" size={18} color="#0066FF" />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.tableCell, { width: 100, color: '#475569' }]}>{row.crew_id || '-'}</Text>
                            <Text style={[styles.tableCell, { width: 150, color: '#0F172A', fontWeight: '500' }]}>{row.crew_name || '-'}</Text>
                            <Text style={[styles.tableCell, { width: 120, color: '#475569' }]}>{row.crew_phone || '-'}</Text>
                            <Text style={[styles.tableCell, { width: 180, color: '#475569' }]}>{row.crew_email || '-'}</Text>
                            <Text style={[styles.tableCell, { width: 200, color: '#475569' }]}>{getSkillNames(row.crew_skills)}</Text>
                            <Text style={[styles.tableCell, { width: 120, color: '#475569' }]}>{row.crew_type || '-'}</Text>
                            <Text style={[styles.tableCell, { width: 100, color: '#475569' }]}>{row.salary ? `₹${row.salary}` : '-'}</Text>
                            <Text style={[styles.tableCell, { width: 250, color: '#475569' }]}>{row.address ? `${row.address}, ${row.city || ''}, ${row.state || ''} ${row.pincode || ''}` : '-'}</Text>
                            <View style={[styles.tableCell, { width: 100 }]}>
                                <View style={[styles.statusBadge, { backgroundColor: row.status == 1 ? '#DCFCE7' : '#FEE2E2' }]}>
                                    <Text style={[styles.statusText, { color: row.status == 1 ? '#166534' : '#991B1B' }]}>
                                        {row.status == 1 ? 'ACTIVE' : 'INACTIVE'}
                                    </Text>
                                </View>
                            </View>
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
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignItems: 'center' },
  statusText: { fontSize: 10, fontWeight: 'bold' },
});
