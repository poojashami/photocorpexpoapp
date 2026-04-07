import React, { useState } from 'react';
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
  FlatList,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

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

export default function AddEventBookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [form, setForm] = useState({
    customer_id: (params.customer_id as string) || '',
    customer_display_id: (params.quotation_id as string) || (params.enquiry_id as string) || '',
    customer_phone: (params.customer_phone as string) || '',
    customer_name: (params.customer_name as string) || '',
    event_id: 'EVT' + Math.floor(Math.random() * 9000 + 1000), 
    event_name: (params.event_name as string) || (params.event_id as string) || '',
    event_status: 'Booked',
    event_for: (params.lead_for as string) || '',
    refer_by: params.quotation_id ? 'Quotation Reference' : (params.enquiry_id ? 'Enquiry Reference' : ''),
    remark: (params.remarks as string) || '',
    bill_amount: (params.bill_amount as string) || '',
    advanced_taken: '0',
    discount: '',
    balance_amount: (params.bill_amount as string) || '',
    payment_type: '',
    com_business_address_id: '1',
    // Post Production
    showPostProduction: false,
    album_type: '',
    no_of_albums: '',
    cover_type: '',
    media_print: '',
    no_of_sheets: '',
    photo_print_no: '',
    no_of_photos: '',
    photo_print_size: '',
    post_prodction_remarks: '',
    highlight: '',
    teaser: '',
    full_movie: '',
    reel: '',
    e_invitation_card: '',
    pen_drive: '',
    // Ceremony
    ceremony_no: 'CER' + Math.floor(Math.random() * 100 + 100),
    ceremony_name: '',
    ceremony_start_date: '',
    ceremony_start_time: '',
    ceremony_end_date: '',
    ceremony_end_time: '',
    ceremony_venue: '',
    ceremony_location: '',
    ceremony_remark: '',
    // Services
    selectedServices: [] as string[]
  });

  const isWithRef = !!(params.enquiry_id || params.quotation_id);
  const refType = params.quotation_id ? 'Quotation' : 'Enquiry';

  const updateForm = (key: string, value: any) => {
    setForm(prev => {
        const updated = { ...prev, [key]: value };
        // Auto calculate balance
        if (['bill_amount', 'advanced_taken', 'discount'].includes(key)) {
            const bill = parseFloat(updated.bill_amount) || 0;
            const advance = parseFloat(updated.advanced_taken) || 0;
            const disc = parseFloat(updated.discount) || 0;
            updated.balance_amount = (bill - (advance + disc)).toFixed(2);
        }
        return updated;
    });
  };

  const handleServiceToggle = (id: string) => {
    const current = [...form.selectedServices];
    const index = current.indexOf(id);
    if (index > -1) current.splice(index, 1);
    else current.push(id);
    updateForm('selectedServices', current);
  };

  const handleSubmit = () => {
    if (!form.customer_name || !form.customer_phone || !form.bill_amount) {
      Alert.alert('Required Fields', 'Please fill Customer Name, Mobile No and Bill Amount');
      return;
    }
    Alert.alert('Success', 'Event Booking Created Successfully!', [
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
        <Text style={styles.headerTitle}>{isWithRef ? `With Reference (${refType})` : 'Without Reference'}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Section 1: Customer Details */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
             <Text style={styles.sectionTitle}>Customer Details</Text>
             <Text style={styles.idBadge}>ID: {form.event_id}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer ID</Text>
            <TextInput 
              style={styles.input} 
              value={form.customer_display_id} 
              onChangeText={(val) => updateForm('customer_display_id', val)}
              placeholder="Search or Enter Customer ID"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile No. *</Text>
            <TextInput 
              style={styles.input} 
              value={form.customer_phone} 
              onChangeText={(val) => updateForm('customer_phone', val)}
              placeholder="10 Digit Mobile No"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer Name *</Text>
            <TextInput 
              style={styles.input} 
              value={form.customer_name} 
              onChangeText={(val) => updateForm('customer_name', val)}
              placeholder="Enter Customer Name"
            />
          </View>

          <CustomPicker 
            label="Event Name *"
            value={form.event_name}
            options={[
              { label: 'Wedding', value: '1' },
              { label: 'Pre-Wedding', value: '2' },
              { label: 'Engagement', value: '3' },
              { label: 'Anniversary Shoots', value: '4' }
            ]}
            onSelect={(val: string) => updateForm('event_name', val)}
          />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Event For</Text>
            <TextInput 
              style={styles.input} 
              value={form.event_for} 
              onChangeText={(val) => updateForm('event_for', val)}
              placeholder="Purpose of event"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reference By</Text>
            <TextInput 
              style={styles.input} 
              value={form.refer_by} 
              onChangeText={(val) => updateForm('refer_by', val)}
              placeholder="Source of reference"
            />
          </View>

          <CustomPicker 
            label="Event Status"
            value={form.event_status}
            options={[
              { label: 'Booked', value: 'Booked' },
              { label: 'Postponed', value: 'Postponed' },
              { label: 'Cancel', value: 'Cancel' },
              { label: 'Delivered', value: 'Delivered' }
            ]}
            onSelect={(val: string) => updateForm('event_status', val)}
          />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Remarks</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              value={form.remark} 
              onChangeText={(val) => updateForm('remark', val)}
              placeholder="Any specific note..."
              multiline
            />
          </View>
        </View>

        {/* Section 2: Financials */}
        <View style={[styles.card, { marginTop: 15 }]}>
          <Text style={styles.sectionTitle}>Financial Summary</Text>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Bill Amount *</Text>
              <TextInput 
                style={styles.input} 
                value={form.bill_amount} 
                onChangeText={(val) => updateForm('bill_amount', val)}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Advance Taken</Text>
              <TextInput 
                style={styles.input} 
                value={form.advanced_taken} 
                onChangeText={(val) => updateForm('advanced_taken', val)}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Discount</Text>
              <TextInput 
                style={styles.input} 
                value={form.discount} 
                onChangeText={(val) => updateForm('discount', val)}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Balance</Text>
              <TextInput 
                style={[styles.input, styles.disabledInput]} 
                value={form.balance_amount} 
                editable={false}
                placeholder="0.00"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Payment Mode</Text>
            <TextInput 
              style={styles.input} 
              value={form.payment_type} 
              onChangeText={(val) => updateForm('payment_type', val)}
              placeholder="Cash/UPI/Bank Transfer"
            />
          </View>
        </View>

        {/* Section 3: Post Production Preferences (Toggle) */}
        <View style={[styles.card, { marginTop: 15 }]}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Post Production</Text>
            <Switch 
               value={form.showPostProduction} 
               onValueChange={(val) => updateForm('showPostProduction', val)}
               trackColor={{ false: "#E2E8F0", true: "#0066FF" }}
            />
          </View>

          {form.showPostProduction && (
            <View style={{ marginTop: 15 }}>
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <CustomPicker 
                            label="Album Type"
                            value={form.album_type}
                            options={[
                                { label: 'Canvera', value: '1' },
                                { label: 'Karizma', value: '2' },
                                { label: 'Digital', value: '3' }
                            ]}
                            onSelect={(val: string) => updateForm('album_type', val)}
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>No. of Albums</Text>
                        <TextInput style={styles.input} value={form.no_of_albums} onChangeText={v => updateForm('no_of_albums',v)} placeholder="0" keyboardType="numeric" />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <CustomPicker 
                            label="Cover Type"
                            value={form.cover_type}
                            options={[
                                { label: 'Leather', value: '1' },
                                { label: 'Acrylic', value: '2' },
                                { label: 'Hardcover', value: '3' }
                            ]}
                            onSelect={(val: string) => updateForm('cover_type', val)}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <CustomPicker 
                            label="Media Print"
                            value={form.media_print}
                            options={[
                                { label: 'Glossy', value: '1' },
                                { label: 'Matte', value: '2' },
                                { label: 'Silk', value: '3' }
                            ]}
                            onSelect={(val: string) => updateForm('media_print', val)}
                        />
                    </View>
                </View>
                
                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>No. of Sheets</Text>
                        <TextInput style={styles.input} value={form.no_of_sheets} onChangeText={v => updateForm('no_of_sheets',v)} keyboardType="numeric" placeholder="0" />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Photo per Sheet</Text>
                        <TextInput style={styles.input} value={form.photo_print_no} onChangeText={v => updateForm('photo_print_no',v)} keyboardType="numeric" placeholder="0" />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>No. of Photos</Text>
                        <TextInput style={styles.input} value={form.no_of_photos} onChangeText={v => updateForm('no_of_photos',v)} keyboardType="numeric" placeholder="0" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <CustomPicker 
                            label="Photo Print Size"
                            value={form.photo_print_size}
                            options={[
                                { label: '4x6', value: '1' },
                                { label: '5x7', value: '2' },
                                { label: '8x10', value: '3' },
                                { label: '12x18', value: '4' }
                            ]}
                            onSelect={(val: string) => updateForm('photo_print_size', val)}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Remarks</Text>
                    <TextInput style={styles.input} value={form.post_prodction_remarks} onChangeText={v => updateForm('post_prodction_remarks',v)} placeholder="Post production remarks..." />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>Highlight</Text>
                        <TextInput style={styles.input} value={form.highlight} onChangeText={v => updateForm('highlight',v)} placeholder="Highlight" />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Teaser</Text>
                        <TextInput style={styles.input} value={form.teaser} onChangeText={v => updateForm('teaser',v)} placeholder="Teaser" />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>Full Movie</Text>
                        <TextInput style={styles.input} value={form.full_movie} onChangeText={v => updateForm('full_movie',v)} placeholder="Full Movie" />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Reel</Text>
                        <TextInput style={styles.input} value={form.reel} onChangeText={v => updateForm('reel',v)} placeholder="Reel" />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>E Invitation Card</Text>
                        <TextInput style={styles.input} value={form.e_invitation_card} onChangeText={v => updateForm('e_invitation_card',v)} placeholder="E Card" />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Pen Drive</Text>
                        <TextInput style={styles.input} value={form.pen_drive} onChangeText={v => updateForm('pen_drive',v)} placeholder="Pen Drive" keyboardType="numeric" />
                    </View>
                </View>
            </View>
          )}
        </View>

        {/* Section 4: Ceremony Details */}
        <View style={[styles.card, { marginTop: 15 }]}>
            <View style={styles.cardHeader}>
                <Text style={styles.sectionTitle}>Ceremony Details</Text>
                <Text style={styles.idBadge}>No: {form.ceremony_no}</Text>
            </View>

            <CustomPicker 
                label="Ceremony Name"
                value={form.ceremony_name}
                options={[
                { label: 'Haldi', value: '1' },
                { label: 'Mehendi', value: '2' },
                { label: 'Wedding', value: '3' },
                { label: 'Reception', value: '4' }
                ]}
                onSelect={(val: string) => updateForm('ceremony_name', val)}
            />

            <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.label}>Start Date</Text>
                    <TextInput style={styles.input} value={form.ceremony_start_date} onChangeText={v => updateForm('ceremony_start_date',v)} placeholder="YYYY-MM-DD" />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Start Time</Text>
                    <TextInput style={styles.input} value={form.ceremony_start_time} onChangeText={v => updateForm('ceremony_start_time',v)} placeholder="HH:MM" />
                </View>
            </View>

            <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.label}>End Date</Text>
                    <TextInput style={styles.input} value={form.ceremony_end_date} onChangeText={v => updateForm('ceremony_end_date',v)} placeholder="YYYY-MM-DD" />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>End Time</Text>
                    <TextInput style={styles.input} value={form.ceremony_end_time} onChangeText={v => updateForm('ceremony_end_time',v)} placeholder="HH:MM" />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Ceremony Venue</Text>
                <TextInput style={[styles.input, { height: 60 }]} value={form.ceremony_venue} onChangeText={v => updateForm('ceremony_venue',v)} placeholder="Location name..." multiline />
            </View>

            <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.label}>Google Location</Text>
                    <TextInput style={styles.input} value={form.ceremony_location} onChangeText={v => updateForm('ceremony_location',v)} placeholder="URL or coordinates" />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Ceremony Remark</Text>
                    <TextInput style={styles.input} value={form.ceremony_remark} onChangeText={v => updateForm('ceremony_remark',v)} placeholder="Additional note" />
                </View>
            </View>
        </View>

        {/* Section 5: Services */}
        <View style={[styles.card, { marginTop: 15, marginBottom: 30 }]}>
            <Text style={styles.sectionTitle}>Select Services</Text>
            <View style={styles.serviceList}>
                {[
                  'Photo Booth', 'Cinematography', 'Traditional Photography', 
                  'Assistant', 'LED Screen', 'Candid Photography', 
                  'Drone Photography', 'Photography', 'Videography'
                ].map(s => (
                    <View key={s} style={styles.serviceRow}>
                        <TouchableOpacity 
                            style={styles.serviceItem}
                            onPress={() => handleServiceToggle(s)}
                        >
                            <Ionicons 
                                name={form.selectedServices.includes(s) ? "checkbox" : "square-outline"} 
                                size={22} 
                                color={form.selectedServices.includes(s) ? "#0066FF" : "#CBD5E1"} 
                            />
                            <Text style={[styles.serviceText, { marginLeft: 10 }]}>{s}</Text>
                        </TouchableOpacity>
                        
                        <View style={styles.qtyContainer}>
                            <TextInput 
                                style={styles.qtyInput}
                                placeholder="Qty"
                                defaultValue="1"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                ))}
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitBtnText}>Submit</Text>
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0066FF', textTransform: 'uppercase', letterSpacing: 0.5 },
  idBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, fontSize: 12, fontWeight: '700', color: '#0F172A' },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', color: '#64748B', marginBottom: 8 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, fontSize: 15, color: '#0F172A' },
  disabledInput: { backgroundColor: '#F1F5F9', color: '#94A3B8' },
  pickerTrigger: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 14 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  serviceList: { marginTop: 15 },
  serviceRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9' 
  },
  serviceItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  serviceText: { fontSize: 15, color: '#0F172A', fontWeight: '500' },
  qtyContainer: { width: 80 },
  qtyInput: { 
    backgroundColor: '#F8FAFC', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 8, 
    paddingHorizontal: 10, 
    paddingVertical: 8, 
    textAlign: 'center',
    fontSize: 14,
    color: '#0F172A'
  },
  submitBtn: { backgroundColor: '#0066FF', borderRadius: 15, paddingVertical: 18, alignItems: 'center', marginTop: 25 },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingBottom: 40, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  modalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalItemText: { fontSize: 16, color: '#475569' },
});
