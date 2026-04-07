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

export default function EnquiryReportScreen() {
  const router = useRouter();
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await ReportService.getEnquiryReports();
      console.log('Enquiry API Response:', response);
      
      // Based on screenshot, root is a direct array
      let fetchedList = [];
      if (Array.isArray(response)) {
        fetchedList = response;
      } else if (response && Array.isArray(response.data)) {
        fetchedList = response.data;
      } else if (response && Array.isArray(response.enquiries)) {
        fetchedList = response.enquiries;
      }
      
      setReportData(fetchedList);
    } catch (error) {
      console.error('Fetch error:', error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    'Action', 'Enquiry ID', 'Enquiry Date', 'Lead Type', 'Source', 'Name', 
    'Email ID', 'Contact Person', 'Mobile No', 'Client Int.', 
    'Follow Up', 'Func. Start Date', 'Opportunity', 'Assigned To', 
    'Quotation ID', 'Event ID', 'Remarks'
  ];

  const formatDate = (val: string) => {
    if (!val || val === '-') return '-';
    try {
        const d = new Date(val);
        if (isNaN(d.getTime())) return val;
        return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
    } catch (e) {
        return val;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Enquiry Report</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Total Enquiries:</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{reportData.length}</Text>
          </View>
        </View>

        <View style={styles.toolbar}>
          <TouchableOpacity onPress={fetchData} style={styles.toolBtn}>
            <Ionicons name="refresh-outline" size={16} color="#0066FF" />
            <Text style={styles.toolText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn}>
            <Ionicons name="download-outline" size={16} color="#0066FF" />
            <Text style={styles.toolText}>Export PDF</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Data Table */}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0066FF" />
          <Text style={styles.loaderText}>Fetching Enquiries...</Text>
        </View>
      ) : (
        <View style={styles.tableWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ minWidth: '100%' }}>
                <View style={styles.tableHeaderRow}>
                    {columns.map((col, i) => (
                        <View key={i} style={[
                            styles.tableCell, 
                            col === 'Action' && { width: 80, alignItems: 'center' },
                            col === 'Enquiry ID' && { width: 120 },
                            col === 'Enquiry Date' && { width: 120 },
                            col === 'Name' && { width: 150 },
                            col === 'Email ID' && { width: 180 },
                            col === 'Remarks' && { width: 250 },
                        ]}>
                            <Text style={styles.headerText}>{col}</Text>
                        </View>
                    ))}
                </View>
                <ScrollView>
                    {reportData.map((row: any, i) => (
                        <View key={i} style={[styles.tableRow, { backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }]}>
                            <View style={[styles.tableCell, { width: 80, justifyContent: 'center', alignItems: 'center' }]}>
                                <TouchableOpacity 
                                    style={styles.actionIconBtn}
                                    onPress={() => {
                                        router.push({
                                            pathname: '/add-event-booking',
                                            params: {
                                                enquiry_id: row.enquiry_id,
                                                customer_id: row.customer_id || '',
                                                customer_name: row.get_lead_data?.name || row.get_customer_data?.customer_name || '',
                                                customer_phone: row.get_lead_data?.mobile_no || row.get_customer_data?.mobile_no || row.mobile_no || '',
                                                customer_email: row.get_lead_data?.email_id || '',
                                                event_id: row.event_id || '',
                                                lead_for: row.lead_for || '',
                                                remarks: row.remarks || ''
                                            }
                                        });
                                    }}
                                >
                                    <Ionicons name="arrow-forward-circle" size={28} color="#0066FF" />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.tableCell, { width: 120, color: '#475569' }]}>{row.enquiry_id || '-'}</Text>
                            <Text style={[styles.tableCell, { width: 120, color: '#475569' }]}>{formatDate(row.enquiry_date)}</Text>
                            <Text style={[styles.tableCell, { color: '#475569' }]}>{row.lead_type || '-'}</Text>
                            <Text style={[styles.tableCell, { color: '#475569' }]}>{row.source_of_enquiry || '-'}</Text>
                            <Text style={[styles.tableCell, { width: 150, color: '#0F172A', fontWeight: '500' }]}>{row.get_lead_data?.name || row.get_customer_data?.customer_name || '-'}</Text>
                            <Text style={[styles.tableCell, { width: 180, color: '#475569' }]}>{row.get_lead_data?.email_id || '-'}</Text>
                            <Text style={[styles.tableCell, { color: '#475569' }]}>{row.get_lead_data?.contact_person || '-'}</Text>
                            <Text style={[styles.tableCell, { color: '#475569' }]}>{row.get_lead_data?.mobile_no || '-'}</Text>
                            <Text style={[styles.tableCell, { color: '#475569' }]}>{row.is_lead_interested || '-'}</Text>
                            <Text style={[styles.tableCell, { color: '#475569' }]}>{formatDate(row.followup_date)}</Text>
                            <Text style={[styles.tableCell, { color: '#475569' }]}>{formatDate(row.event_tentative_date)}</Text>
                            <Text style={[styles.tableCell, { color: '#475569' }]}>{row.move_to_opportunity || '-'}</Text>
                            <Text style={[styles.tableCell, { color: '#475569' }]}>{row.task_assigned || '-'}</Text>
                            <Text style={[styles.tableCell, { color: '#475569' }]}>{row.quotation_id || '-'}</Text>
                            <Text style={[styles.tableCell, { color: '#475569' }]}>{row.event_id || '-'}</Text>
                            <Text style={[styles.tableCell, { width: 250, color: '#475569' }]}>{row.remarks || '-'}</Text>
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
  tableCell: { width: 130, padding: 15, justifyContent: 'center' },
  headerText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  actionIconBtn: {
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
