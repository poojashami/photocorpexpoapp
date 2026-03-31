import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Platform, 
  Modal, 
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';
import { useRouter } from 'expo-router';

// Dummy dataset mimicking the PHP backend loop
const reportData = [
  {
    id: 1,
    enquiry_id: 'ENQ1001',
    created_at: '21-03-2026',
    lead_type: 'New Customer',
    source: 'Facebook',
    name: 'Rahul Malhotra',
    email: 'rahul@gmail.com',
    contact_person: 'Rahul',
    mobile: '9876543210',
    interested: 'Yes',
    followup: '25-03-2026',
    tentative_date: '10-04-2026',
    opportunity: 'Yes',
    task_assigned: 'Admin',
    quotation_id: 'Q-001',
    event_id: 'EVT-001'
  },
  {
    id: 2,
    enquiry_id: 'ENQ1002',
    created_at: '20-03-2026',
    lead_type: 'Existing Customer',
    source: 'Instagram',
    name: 'Simran Kaur',
    email: 'simran@gmail.com',
    contact_person: '-',
    mobile: '9123456789',
    interested: 'Call Again',
    followup: '22-03-2026',
    tentative_date: '15-05-2026',
    opportunity: 'No',
    task_assigned: 'Editor',
    quotation_id: '-',
    event_id: 'EVT-002'
  },
  {
    id: 3,
    enquiry_id: 'ENQ1003',
    created_at: '19-03-2026',
    lead_type: 'New Customer',
    source: 'Website',
    name: 'Vivek Gupta',
    email: 'vivek@company.com',
    contact_person: 'HR Dept',
    mobile: '9988776655',
    interested: 'Yes',
    followup: '20-03-2026',
    tentative_date: '05-12-2026',
    opportunity: 'Yes',
    task_assigned: 'Admin',
    quotation_id: 'Q-005',
    event_id: 'EVT-009'
  }
];

export default function EnquiryReportScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);

  // Table Columns
  const columns = [
    'Action', 'Enquiry ID', 'Enquiry Date', 'Lead Type', 'Source', 
    'Name', 'Email ID', 'Contact Person', 'Mobile No', 'Client Int.',
    'Follow Up Date', 'Function Start', 'Move to Opp.', 'Task Assign',
    'Quotation ID', 'Event ID'
  ];

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header Panel */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
            <TouchableOpacity 
              onPress={handleBack} 
              style={styles.backBtn}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Ionicons name="arrow-back" size={26} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Enquiry Reports</Text>
            <View style={{ width: 40 }} />
        </View>

        <View style={styles.statsRow}>
           <Text style={[styles.statsLabel, { color: theme.text }]}>Total Enquiries:</Text>
           <View style={[styles.badge, { backgroundColor: theme.tint }]}>
              <Text style={styles.badgeText}>{reportData.length}</Text>
           </View>
        </View>

        {/* Toolbar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolbar}>
           <TouchableOpacity style={[styles.toolBtn, { borderColor: theme.border }]} onPress={() => setFilterModalVisible(true)}>
              <Ionicons name="filter" size={16} color={theme.text} />
              <Text style={[styles.toolText, { color: theme.text }]}>Filters & Columns</Text>
           </TouchableOpacity>

           <TouchableOpacity style={[styles.toolBtn, { borderColor: theme.border }]} onPress={() => setExportModalVisible(true)}>
              <Ionicons name="download" size={16} color={theme.text} />
              <Text style={[styles.toolText, { color: theme.text }]}>Export</Text>
           </TouchableOpacity>

           <TouchableOpacity style={[styles.toolBtn, { borderColor: theme.border }]}>
              <Ionicons name="refresh" size={16} color="#FFD700" />
              <Text style={[styles.toolText, { color: '#FFD700' }]}>Clear All</Text>
           </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Main Data Table */}
      <View style={[styles.tableWrapper, { backgroundColor: theme.card }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeaderRow, { backgroundColor: '#000030', borderBottomColor: theme.tint }]}>
                    {columns.map((col, index) => (
                        <View key={index} style={[styles.tableCell, styles.headerCell]}>
                            <Text style={styles.headerText}>{col}</Text>
                            {index > 0 && <Ionicons name="filter-outline" size={12} color="rgba(255,255,255,0.5)" style={{marginLeft: 5}} />}
                        </View>
                    ))}
                </View>

                {/* Table Body */}
                <ScrollView showsVerticalScrollIndicator={true}>
                    {reportData.map((row, index) => (
                        <View key={row.id} style={[styles.tableRow, { borderBottomColor: theme.border, backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }]}>
                            {/* Action Item */}
                            <View style={[styles.tableCell, { flexDirection: 'row', gap: 10 }]}>
                                <TouchableOpacity><Ionicons name="create" size={18} color="#FFC107" /></TouchableOpacity>
                                <TouchableOpacity><Ionicons name="eye" size={18} color="#4A90E2" /></TouchableOpacity>
                            </View>
                            
                            <Text style={[styles.tableCell, { color: theme.text }]}>{row.enquiry_id}</Text>
                            <Text style={[styles.tableCell, { color: theme.text }]}>{row.created_at}</Text>
                            <Text style={[styles.tableCell, { color: theme.text }]}>{row.lead_type}</Text>
                            <Text style={[styles.tableCell, { color: theme.text }]}>{row.source}</Text>
                            <Text style={[styles.tableCell, { color: theme.text }]}>{row.name}</Text>
                            <Text style={[styles.tableCell, { color: theme.text }]}>{row.email}</Text>
                            <Text style={[styles.tableCell, { color: theme.text }]}>{row.contact_person}</Text>
                            <Text style={[styles.tableCell, { color: theme.text }]}>{row.mobile}</Text>
                            
                            <View style={[styles.tableCell]}>
                                <Text style={[{ color: row.interested === 'Yes' ? '#4CAF50' : '#FFC107' }]}>{row.interested}</Text>
                            </View>
                            
                            <Text style={[styles.tableCell, { color: theme.text }]}>{row.followup}</Text>
                            <Text style={[styles.tableCell, { color: theme.text }]}>{row.tentative_date}</Text>
                            <Text style={[styles.tableCell, { color: theme.text }]}>{row.opportunity}</Text>
                            <Text style={[styles.tableCell, { color: theme.text }]}>{row.task_assigned}</Text>
                            
                            <TouchableOpacity style={styles.tableCell}>
                                <Text style={{ color: theme.tint, textDecorationLine: 'underline' }}>{row.quotation_id}</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.tableCell}>
                                <Text style={{ color: theme.tint, textDecorationLine: 'underline' }}>{row.event_id}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
          </ScrollView>
      </View>

      {/* Export Modal */}
      <Modal visible={exportModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
             <Text style={[styles.modalTitle, { color: theme.text }]}>Export Report</Text>
             
             <TouchableOpacity style={[styles.exportOption, { borderBottomColor: theme.border }]}>
                <Ionicons name="document-text" size={24} color="#4CAF50" />
                <Text style={[styles.exportText, { color: theme.text }]}>Export as Excel</Text>
             </TouchableOpacity>

             <TouchableOpacity style={[styles.exportOption, { borderBottomColor: theme.border }]}>
                <Ionicons name="list" size={24} color="#2196F3" />
                <Text style={[styles.exportText, { color: theme.text }]}>Export as CSV</Text>
             </TouchableOpacity>

             <TouchableOpacity style={[styles.exportOption, { borderBottomColor: theme.border, borderBottomWidth: 0 }]}>
                <Ionicons name="document" size={24} color="#F44336" />
                <Text style={[styles.exportText, { color: theme.text }]}>Export as PDF</Text>
             </TouchableOpacity>

             <TouchableOpacity style={styles.cancelBtn} onPress={() => setExportModalVisible(false)}>
                <Text style={{ color: '#000', fontWeight: 'bold' }}>CANCEL</Text>
             </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Filter Modal Mock */}
      <Modal visible={filterModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border, height: '60%' }]}>
             <Text style={[styles.modalTitle, { color: theme.text }]}>Manage Filters & Columns</Text>
             <Text style={{ color: '#888', marginBottom: 20 }}>Select columns to hide or apply data filters.</Text>
             <ScrollView>
                 {columns.map((c, i) => (
                     <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                         <Ionicons name="checkbox" size={24} color={theme.tint} />
                         <Text style={{ color: theme.text, marginLeft: 10, fontSize: 16 }}>{c}</Text>
                     </View>
                 ))}
             </ScrollView>
             <TouchableOpacity style={styles.cancelBtn} onPress={() => setFilterModalVisible(false)}>
                <Text style={{ color: '#000', fontWeight: 'bold' }}>APPLY FILTERS</Text>
             </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  backBtn: {
    padding: 10,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  toolbar: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  toolText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableWrapper: {
    flex: 1,
    margin: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tableHeaderRow: {
    borderBottomWidth: 2,
  },
  tableCell: {
    width: 130,
    padding: 15,
    justifyContent: 'center',
  },
  headerCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 25,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  exportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  exportText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 15,
  },
  cancelBtn: {
    backgroundColor: '#D4AF37',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  }
});
