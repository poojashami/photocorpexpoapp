import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Platform, 
  Modal, 
  FlatList,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';
import { useRouter } from 'expo-router';

// Custom Select Component for robust mobile dropdowns
const CustomSelect = ({ label, value, options, onSelect, disabled = false }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];

  const selectedOption = options.find((o: any) => o.value === value);

  return (
    <>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <TouchableOpacity 
        style={[styles.input, { backgroundColor: disabled ? 'rgba(255,255,255,0.05)' : theme.card, borderColor: theme.border, opacity: disabled ? 0.6 : 1 }]} 
        onPress={() => !disabled && setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={{ color: selectedOption ? theme.text : '#888' }}>
          {selectedOption ? selectedOption.label : 'Select'}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#888" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Select {label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            <FlatList 
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.modalItem, { borderBottomColor: theme.border }]}
                  onPress={() => {
                    onSelect(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalItemText, { color: theme.text, fontWeight: value === item.value ? 'bold' : 'normal' }]}>
                    {item.label}
                  </Text>
                  {value === item.value && <Ionicons name="checkmark" size={20} color={theme.tint} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default function AddEnquiryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];

  // Form States
  const [leadType, setLeadType] = useState('newCustomer');
  const [enquiryDate, setEnquiryDate] = useState(new Date().toISOString().split('T')[0]);
  const [enquiryType, setEnquiryType] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [emailId, setEmailId] = useState('');
  
  const [eventId, setEventId] = useState('');
  const [leadFor, setLeadFor] = useState('');
  const [selectedCeremonies, setSelectedCeremonies] = useState<string[]>([]);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sourceEnquiry, setSourceEnquiry] = useState('');
  const [sourceRemark, setSourceRemark] = useState('');
  
  const [leadInterested, setLeadInterested] = useState('');
  const [followupDate, setFollowupDate] = useState('');
  const [moveToOpportunity, setMoveToOpportunity] = useState('');
  const [taskAssigned, setTaskAssigned] = useState('');
  const [ivrNo, setIvrNo] = useState('');
  const [remarks, setRemarks] = useState('');

  // Dummy Data for dropdowns
  const eventOptions = [
    { label: 'Wedding', value: '1' },
    { label: 'Pre-Wedding', value: '2' },
    { label: 'Corporate Event', value: '3' },
    { label: 'Birthday', value: '4' },
    { label: 'Other', value: 'other' },
  ];

  // Dynamic Data Mapping for Ceremonies based on Event ID
  const eventCeremonyMap: Record<string, {id: string, name: string}[]> = {
    '1': [ // Wedding
      { id: '1', name: 'Haldi' },
      { id: '2', name: 'Mehendi' },
      { id: '3', name: 'Sangeet' },
      { id: '4', name: 'Reception' },
      { id: '5', name: 'Engagement' },
      { id: '6', name: 'Wedding Day' },
    ],
    '2': [ // Pre-Wedding
      { id: '7', name: 'Indoor Shoot' },
      { id: '8', name: 'Outdoor Shoot' },
    ],
    '3': [ // Corporate Event
      { id: '9', name: 'Conference' },
      { id: '10', name: 'Gala Dinner' },
      { id: '11', name: 'Award Ceremony' },
    ],
    '4': [ // Birthday
      { id: '12', name: 'Cake Cutting' },
      { id: '13', name: 'Party' },
    ],
  };

  const activeCeremonies = eventCeremonyMap[eventId] || [];

  // Reset selected ceremonies when event changes
  useEffect(() => {
    setSelectedCeremonies([]);
  }, [eventId]);

  const handleCeremonyToggle = (id: string) => {
    setSelectedCeremonies(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if(!customerName || !mobileNo) {
        Alert.alert('Validation Error', 'Customer Name and Mobile No are required.');
        return;
    }
    Alert.alert('Success', 'Enquiry saved successfully!', [
        { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleBack} 
          style={styles.backBtn}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Ionicons name="arrow-back" size={26} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Add New Enquiry</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.formContainer} contentContainerStyle={{ paddingBottom: 50 }}>
        
        <CustomSelect 
          label="Lead Type *"
          value={leadType}
          options={[
            { label: 'New Customer', value: 'newCustomer' },
            { label: 'Existing Customer', value: 'existingCustomer' }
          ]}
          onSelect={setLeadType}
        />

        <Text style={[styles.label, { color: theme.text }]}>Enquiry Date *</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]} 
          value={enquiryDate}
          onChangeText={setEnquiryDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#888"
        />

        {/* Conditional Rendering based on Lead Type */}
        {leadType === 'existingCustomer' && (
           <>
            <Text style={[styles.label, { color: theme.text }]}>Customer ID</Text>
            <TextInput 
                style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]} 
                value={customerId}
                onChangeText={setCustomerId}
                placeholder="Search or enter ID"
                placeholderTextColor="#888"
            />
           </>
        )}

        <CustomSelect 
          label="Enquiry Type *"
          value={enquiryType}
          options={[
            { label: 'Individual', value: 'Individual' },
            { label: 'Corporate', value: 'Corporate' },
            { label: 'Studio', value: 'Studio' }
          ]}
          onSelect={setEnquiryType}
          disabled={leadType === 'existingCustomer' && customerId !== ''} // Just a visual mock of disabled behavior
        />

        <Text style={[styles.label, { color: theme.text }]}>Customer Name *</Text>
        <TextInput 
            style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]} 
            value={customerName}
            onChangeText={setCustomerName}
            placeholder="Enter customer name"
            placeholderTextColor="#888"
        />

        <Text style={[styles.label, { color: theme.text }]}>Contact Person</Text>
        <TextInput 
            style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]} 
            value={contactPerson}
            onChangeText={setContactPerson}
            placeholder="Enter contact person"
            placeholderTextColor="#888"
        />

        <Text style={[styles.label, { color: theme.text }]}>Mobile No *</Text>
        <TextInput 
            style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]} 
            value={mobileNo}
            onChangeText={setMobileNo}
            placeholder="Enter mobile number"
            placeholderTextColor="#888"
            keyboardType="numeric"
            maxLength={10}
        />

        <Text style={[styles.label, { color: theme.text }]}>Email ID</Text>
        <TextInput 
            style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]} 
            value={emailId}
            onChangeText={setEmailId}
            placeholder="Enter email address"
            placeholderTextColor="#888"
            keyboardType="email-address"
        />

        {/* Event section */}
        <CustomSelect 
          label="Event Name"
          value={eventId}
          options={eventOptions}
          onSelect={setEventId}
        />

        {eventId === 'other' && (
          <>
            <Text style={[styles.label, { color: theme.text }]}>Lead For *</Text>
            <TextInput 
              style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]} 
              value={leadFor}
              onChangeText={setLeadFor}
              placeholder="Specify the reason"
              placeholderTextColor="#888"
            />
          </>
        )}

        {/* Ceremonies Checkboxes conditional on Event */}
        {activeCeremonies.length > 0 && (
          <>
            <Text style={[styles.label, { color: theme.text, marginTop: 10 }]}>Ceremony Name</Text>
            <View style={styles.ceremonyContainer}>
              {activeCeremonies.map(ceremony => (
                <TouchableOpacity 
                  key={ceremony.id} 
                  style={styles.checkboxRow}
                  onPress={() => handleCeremonyToggle(ceremony.id)}
                >
                  <View style={[styles.checkbox, { borderColor: theme.tint, backgroundColor: selectedCeremonies.includes(ceremony.id) ? theme.tint : 'transparent' }]}>
                    {selectedCeremonies.includes(ceremony.id) && <Ionicons name="checkmark" size={14} color="#000" />}
                  </View>
                  <Text style={{ color: theme.text, marginLeft: 10 }}>{ceremony.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Additional Details */}
        <Text style={[styles.label, { color: theme.text }]}>Function Start Date</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]} 
          value={startDate}
          onChangeText={setStartDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#888"
        />

        <Text style={[styles.label, { color: theme.text }]}>Function End Date</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]} 
          value={endDate}
          onChangeText={setEndDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#888"
        />

        <CustomSelect 
          label="Source of Enquiry"
          value={sourceEnquiry}
          options={[
            { label: 'Facebook', value: '1' },
            { label: 'Instagram', value: '2' },
            { label: 'Referral', value: '3' }
          ]}
          onSelect={setSourceEnquiry}
        />

        <Text style={[styles.label, { color: theme.text }]}>Remark of Source</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]} 
          value={sourceRemark}
          onChangeText={setSourceRemark}
          placeholder="Enter remarks"
          placeholderTextColor="#888"
        />

        <CustomSelect 
          label="Is Lead Interested"
          value={leadInterested}
          options={[
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
            { label: 'Call Again', value: 'Call Again' }
          ]}
          onSelect={setLeadInterested}
        />

        <Text style={[styles.label, { color: theme.text }]}>Follow Up Date</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]} 
          value={followupDate}
          onChangeText={setFollowupDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#888"
        />

        <CustomSelect 
          label="Move to Opportunity"
          value={moveToOpportunity}
          options={[
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' }
          ]}
          onSelect={setMoveToOpportunity}
        />

        <CustomSelect 
          label="Task Assign To"
          value={taskAssigned}
          options={[
            { label: 'Admin', value: '1' },
            { label: 'Editor', value: '2' }
          ]}
          onSelect={setTaskAssigned}
        />

        <Text style={[styles.label, { color: theme.text }]}>IVR Number</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]} 
          value={ivrNo}
          onChangeText={setIvrNo}
          placeholder="Enter IVR Number"
          placeholderTextColor="#888"
        />
        
        <Text style={[styles.label, { color: theme.text }]}>Remarks</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border, height: 80, textAlignVertical: 'top' }]} 
          value={remarks}
          onChangeText={setRemarks}
          placeholder="Enter detailed remarks"
          placeholderTextColor="#888"
          multiline
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
           <Text style={styles.submitBtnText}>SAVE ENQUIRY</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  backBtn: {
    padding: 10,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ceremonyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 15,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtn: {
    backgroundColor: '#D4AF37',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 50,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    paddingBottom: 40,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalItemText: {
    fontSize: 16,
  }
});
