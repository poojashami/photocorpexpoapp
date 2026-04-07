import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Platform, 
  Alert,
  KeyboardAvoidingView,
  Dimensions,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Generic Select Component
const CustomPicker = ({ label, value, options, onSelect, placeholder = 'Select' }: any) => {
  const [visible, setVisible] = useState(false);
  const selectedOption = options.find((o: any) => o.value === value);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={styles.pickerTrigger} 
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={{ color: selectedOption ? '#0F172A' : '#64748B', fontSize: 15 }}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#64748B" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{label}</Text>
                <TouchableOpacity onPress={() => setVisible(false)}>
                    <Ionicons name="close" size={24} color="#0F172A" />
                </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item.value);
                    setVisible(false);
                  }}
                >
                  <Text style={[styles.modalItemText, value === item.value && { color: '#0066FF', fontWeight: 'bold' }]}>
                    {item.label}
                  </Text>
                  {value === item.value && <Ionicons name="checkmark" size={20} color="#0066FF" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default function AddEnquiryScreen() {
  const router = useRouter();
  
  // State from Blade Template
  const [form, setForm] = useState({
    enquiry_id: 'ENQIND45', // Mocking max_enq_id
    lead_type: 'newCustomer',
    enquiry_date: new Date().toISOString().split('T')[0],
    enquiry_type: 'Individual',
    lead_id: '101',
    customer_name: '',
    contact_person: '',
    mobile_no: '',
    email_id: '',
    event_id: '',
    lead_for: '',
    selectedCeremonies: [] as string[],
    start_date: '',
    end_date: '',
    source: '',
    source_remark: '',
    interested: '',
    followup_date: '',
    opportunity: '',
    task_assigned: '',
    ivr_no: '',
    remarks: ''
  });

  const updateForm = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleCeremonyToggle = (id: string) => {
    const current = [...form.selectedCeremonies];
    const index = current.indexOf(id);
    if (index > -1) current.splice(index, 1);
    else current.push(id);
    updateForm('selectedCeremonies', current);
  };

  const ceremonyOptions = [
    { id: '1', name: 'Haldi' },
    { id: '2', name: 'Mehendi' },
    { id: '3', name: 'Sangeet' },
    { id: '4', name: 'Reception' },
    { id: '5', name: 'Engagement' },
    { id: '6', name: 'Wedding Day' },
  ];

  const handleSubmit = () => {
    if (!form.customer_name || !form.mobile_no) {
      Alert.alert('Required Fields', 'Please fill Customer Name and Mobile No');
      return;
    }
    Alert.alert('Success', 'Enquiry Submitted Successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Enquiry</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>General Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Enquiry ID</Text>
            <TextInput 
              style={[styles.input, styles.disabledInput]} 
              value={form.enquiry_id} 
              editable={false} 
            />
          </View>

          <CustomPicker 
            label="Lead Type *"
            value={form.lead_type}
            options={[
              { label: 'New Customer', value: 'newCustomer' },
              { label: 'Existing Customer', value: 'existingCustomer' }
            ]}
            onSelect={(val: string) => updateForm('lead_type', val)}
          />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Enquiry Date *</Text>
            <TextInput 
              style={styles.input} 
              value={form.enquiry_date} 
              onChangeText={(val) => updateForm('enquiry_date', val)}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <CustomPicker 
            label="Enquiry Type *"
            value={form.enquiry_type}
            options={[
              { label: 'Individual', value: 'Individual' },
              { label: 'Corporate', value: 'Corporate' },
              { label: 'Studio', value: 'Studio' }
            ]}
            onSelect={(val: string) => updateForm('enquiry_type', val)}
          />

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Customer Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{form.lead_type === 'newCustomer' ? 'Customer ID' : 'Search Customer ID'}</Text>
            <TextInput 
              style={[styles.input, form.lead_type === 'newCustomer' && styles.disabledInput]} 
              value={form.lead_id} 
              editable={form.lead_type !== 'newCustomer'}
              onChangeText={(val) => updateForm('lead_id', val)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer Name *</Text>
            <TextInput 
              style={styles.input} 
              value={form.customer_name} 
              onChangeText={(val) => updateForm('customer_name', val)}
              placeholder="Enter Full Name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile No *</Text>
            <TextInput 
              style={styles.input} 
              value={form.mobile_no} 
              onChangeText={(val) => updateForm('mobile_no', val)}
              placeholder="10 Digit Number"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email ID</Text>
            <TextInput 
              style={styles.input} 
              value={form.email_id} 
              onChangeText={(val) => updateForm('email_id', val)}
              placeholder="example@mail.com"
              keyboardType="email-address"
            />
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Event Information</Text>

          <CustomPicker 
            label="Event Name"
            value={form.event_id}
            options={[
              { label: 'Wedding', value: '1' },
              { label: 'Pre-Wedding', value: '2' },
              { label: 'Engagement', value: '3' },
              { label: 'Other', value: 'other' }
            ]}
            onSelect={(val: string) => updateForm('event_id', val)}
          />

          {form.event_id === 'other' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Lead For *</Text>
              <TextInput 
                style={styles.input} 
                value={form.lead_for} 
                onChangeText={(val) => updateForm('lead_for', val)}
                placeholder="Specify event type"
              />
            </View>
          )}

          {form.event_id !== '' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ceremony Names</Text>
              <View style={styles.ceremonyGrid}>
                {ceremonyOptions.map(c => (
                  <TouchableOpacity 
                    key={c.id} 
                    style={[
                        styles.chip, 
                        form.selectedCeremonies.includes(c.id) && styles.activeChip
                    ]}
                    onPress={() => handleCeremonyToggle(c.id)}
                  >
                    <Text style={[styles.chipText, form.selectedCeremonies.includes(c.id) && styles.activeChipText]}>
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Start Date</Text>
              <TextInput 
                style={styles.input} 
                value={form.start_date} 
                onChangeText={(val) => updateForm('start_date', val)}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>End Date</Text>
              <TextInput 
                style={styles.input} 
                value={form.end_date} 
                onChangeText={(val) => updateForm('end_date', val)}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Additional Details</Text>

          <CustomPicker 
            label="Source"
            value={form.source}
            options={[
              { label: 'Facebook', value: '1' },
              { label: 'Instagram', value: '2' },
              { label: 'Google', value: '3' },
              { label: 'Reference', value: '4' }
            ]}
            onSelect={(val: string) => updateForm('source', val)}
          />

          <CustomPicker 
            label="Interested?"
            value={form.interested}
            options={[
              { label: 'Yes', value: 'Yes' },
              { label: 'No', value: 'No' },
              { label: 'Call Again', value: 'Call Again' }
            ]}
            onSelect={(val: string) => updateForm('interested', val)}
          />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Follow Up Date</Text>
            <TextInput 
              style={styles.input} 
              value={form.followup_date} 
              onChangeText={(val) => updateForm('followup_date', val)}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <CustomPicker 
            label="Task Assigned"
            value={form.task_assigned}
            options={[
              { label: 'Admin User', value: '1' },
              { label: 'Sales Team', value: '2' }
            ]}
            onSelect={(val: string) => updateForm('task_assigned', val)}
          />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Remarks</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              value={form.remarks} 
              onChangeText={(val) => updateForm('remarks', val)}
              placeholder="Add any specific requirements..."
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Submit Enquiry</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    paddingBottom: 20, 
    backgroundColor: '#FFFFFF' 
  },
  backBtn: { padding: 5, marginLeft: -10 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  scrollContent: { padding: 15 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0066FF', marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', color: '#64748B', marginBottom: 8 },
  input: { 
    backgroundColor: '#F8FAFC', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    paddingVertical: 12, 
    fontSize: 15, 
    color: '#0F172A' 
  },
  disabledInput: { backgroundColor: '#F1F5F9', color: '#94A3B8' },
  pickerTrigger: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#F8FAFC', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    paddingVertical: 14 
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  ceremonyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  activeChip: { backgroundColor: '#E0EBFF', borderColor: '#0066FF' },
  chipText: { fontSize: 13, color: '#64748B' },
  activeChipText: { color: '#0066FF', fontWeight: 'bold' },
  submitBtn: { backgroundColor: '#0066FF', borderRadius: 15, paddingVertical: 18, alignItems: 'center', marginTop: 25 },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingBottom: 40, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  modalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalItemText: { fontSize: 16, color: '#475569' },
});
