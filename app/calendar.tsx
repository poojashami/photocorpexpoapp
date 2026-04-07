import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Platform, 
  ActivityIndicator,
  Dimensions,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ReportService } from '../services/ReportService';

const { width } = Dimensions.get('window');

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarScreen() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Full Calendar usually needs a range. We'll take the current month's start/end
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1).toISOString().split('T')[0];
      const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0];
      
      const response = await ReportService.getCalendarData(firstDay, lastDay);
      setEvents(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDisplayDateShort = (dt: string) => {
    if (!dt) return '-';
    try {
        const d = new Date(dt);
        if (isNaN(d.getTime())) return dt;
        return `${d.getDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]}`;
    } catch (e) {
        return dt;
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ceremony Calendar</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={() => {
            const d = new Date(currentDate);
            d.setMonth(d.getMonth() - 1);
            setCurrentDate(d);
        }}>
            <Ionicons name="chevron-back" size={24} color="#0066FF" />
        </TouchableOpacity>
        <Text style={styles.monthLabel}>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Text>
        <TouchableOpacity onPress={() => {
            const d = new Date(currentDate);
            d.setMonth(d.getMonth() + 1);
            setCurrentDate(d);
        }}>
            <Ionicons name="chevron-forward" size={24} color="#0066FF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const todayStr = new Date().toISOString().split('T')[0];

    const calendarRows = [];
    let currentDay = 1;

    // Weekday headers
    const dayHeaders = (
        <View style={styles.weekHeaderRow}>
            {DAYS.map(d => <Text key={d} style={styles.weekHeaderLabel}>{d}</Text>)}
        </View>
    );

    for (let i = 0; i < 6; i++) { // Max 6 rows
        const days = [];
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                days.push(<View key={`empty-${j}`} style={[styles.dayCell, styles.emptyDayCell]} />);
            } else if (currentDay > daysInMonth) {
                days.push(<View key={`empty-${currentDay}-${j}`} style={[styles.dayCell, styles.emptyDayCell]} />);
            } else {
                const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;
                const isToday = dayStr === todayStr;
                const isSelected = dayStr === selectedDate;
                const dailyEvents = events.filter(e => e.start?.startsWith(dayStr));
                
                const d = currentDay;
                const curDayStr = dayStr;
                days.push(
                    <TouchableOpacity 
                        key={dayStr} 
                        style={[
                            styles.dayCell, 
                            isToday && styles.todayCell,
                            isSelected && styles.selectedCell
                        ]}
                        activeOpacity={0.7}
                        onPress={() => setSelectedDate(curDayStr)}
                    >
                        <Text style={[
                            styles.dayText, 
                            isToday && styles.todayText,
                            isSelected && styles.selectedText
                        ]}>{d}</Text>
                        <View style={styles.eventPillContainer}>
                            {dailyEvents.slice(0, 2).map((e, idx) => (
                                <View key={idx} style={[
                                    styles.eventPill, 
                                    { 
                                        backgroundColor: (e.backgroundColor || '#0066FF') + '1A',
                                        borderColor: e.backgroundColor || '#0066FF'
                                    }
                                ]}>
                                    <Text style={[styles.eventPillText, { color: e.backgroundColor || '#0066FF' }]} numberOfLines={1}>
                                        {e.title}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </TouchableOpacity>
                );
                currentDay++;
            }
        }
        calendarRows.push(<View key={i} style={styles.weekRow}>{days}</View>);
        if (currentDay > daysInMonth) break;
    }

    return (
        <View style={styles.calendarCard}>
            {dayHeaders}
            {calendarRows}
        </View>
    );
  };

  const formatDisplayDate = (dt: string) => {
    if (!dt) return '-';
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    try {
        const datePart = dt.includes('T') ? dt.split('T')[0] : dt.split(' ')[0];
        const d = new Date(datePart);
        if (isNaN(d.getTime())) return dt;
        return `${d.getDate()} ${monthNames[d.getMonth()]}, ${d.getFullYear()}`;
    } catch (e) {
        return dt;
    }
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '-';
    try {
        const [hour, minute] = timeStr.split(':');
        const h = parseInt(hour, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedHour = h % 12 || 12;
        return `${formattedHour}:${minute} ${ampm}`;
    } catch (e) {
        return timeStr;
    }
  };

  const renderEventDetails = () => {
    if (!selectedEvent) return null;
    
    // Some APIs return data at top level, others nest it in extendedProps
    const e = selectedEvent;
    const ep = e.extendedProps || {};
    
    const customerName = e.customerName || ep.customerName || '-';
    const customerMobile = e.customerMobile || ep.customerMobile || '-';
    const eventName = e.eventName || ep.eventName || '-';
    const starttime = e.starttime || ep.starttime || '';
    const endtime = e.endtime || ep.endtime || '';
    const venue = e.venue || ep.venue || '-';
    // Checking multiple possible keys for Google Location
    const googleLocation = e.google_location || ep.google_location || 
                         e.map_link || ep.map_link || 
                         e.location_url || ep.location_url || 
                         e.venue_google_location || ep.venue_google_location || '';

    return (
        <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <View>
                            <Text style={styles.modalCategory}>Ceremony Detail</Text>
                            <Text style={styles.modalTitle}>{e.title}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color="#0F172A" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                        <View style={styles.infoBlock}>
                            <View style={[styles.iconBox, { backgroundColor: '#F0F9FF' }]}>
                                <Ionicons name="person-outline" size={20} color="#0066FF" />
                            </View>
                            <View>
                                <Text style={styles.infoLabel}>Customer Name</Text>
                                <Text style={styles.infoValue}>{customerName}</Text>
                            </View>
                        </View>

                        <View style={styles.infoBlock}>
                            <View style={[styles.iconBox, { backgroundColor: '#F0F9FF' }]}>
                                <Ionicons name="call-outline" size={20} color="#0066FF" />
                            </View>
                            <View>
                                <Text style={styles.infoLabel}>Mobile No</Text>
                                <Text style={styles.infoValue}>{customerMobile}</Text>
                            </View>
                        </View>

                        <View style={styles.infoBlock}>
                            <View style={[styles.iconBox, { backgroundColor: '#F8FAFC' }]}>
                                <Ionicons name="briefcase-outline" size={20} color="#64748B" />
                            </View>
                            <View>
                                <Text style={styles.infoLabel}>Event</Text>
                                <Text style={styles.infoValue}>{eventName}</Text>
                            </View>
                        </View>

                        <View style={styles.infoBlock}>
                            <View style={[styles.iconBox, { backgroundColor: '#F8FAFC' }]}>
                                <Ionicons name="star-outline" size={20} color="#64748B" />
                            </View>
                            <View>
                                <Text style={styles.infoLabel}>Ceremony</Text>
                                <Text style={styles.infoValue}>{e.title || '-'}</Text>
                            </View>
                        </View>

                        <View style={styles.infoBlock}>
                            <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
                                <Ionicons name="calendar-outline" size={20} color="#EF4444" />
                            </View>
                            <View>
                                <Text style={styles.infoLabel}>Date</Text>
                                <Text style={styles.infoValue}>{formatDisplayDate(e.start)}</Text>
                            </View>
                        </View>

                        <View style={styles.infoBlock}>
                            <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
                                <Ionicons name="time-outline" size={20} color="#EF4444" />
                            </View>
                            <View>
                                <Text style={styles.infoLabel}>Time</Text>
                                <Text style={styles.infoValue}>
                                    {formatTime(starttime)}
                                    {endtime ? ` to ${formatTime(endtime)}` : ''}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.infoBlock}>
                            <View style={[styles.iconBox, { backgroundColor: '#FEFCE8' }]}>
                                <Ionicons name="location-outline" size={20} color="#EAB308" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.infoLabel}>Venue</Text>
                                <Text style={styles.infoValue}>{venue}</Text>
                            </View>
                        </View>

                        {googleLocation ? (
                            <View style={styles.infoBlock}>
                                <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
                                    <Ionicons name="map-outline" size={20} color="#22C55E" />
                                </View>
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => {
                                    if (googleLocation.startsWith('http')) {
                                        require('expo-linking').openURL(googleLocation);
                                    }
                                }}>
                                    <Text style={styles.infoLabel}>Google Location</Text>
                                    <Text style={[styles.infoValue, googleLocation.startsWith('http') && { color: '#0066FF', textDecorationLine: 'underline' }]} numberOfLines={2}>
                                        {googleLocation}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}

                        {(e.services || ep.services) && (e.services || ep.services).length > 0 && (
                            <View style={styles.tableCard}>
                                <View style={styles.tableHeader}>
                                    <Text style={styles.tableHeaderText}>Service</Text>
                                    <Text style={styles.tableHeaderText}>Crew</Text>
                                </View>
                                {(e.services || ep.services).map((s: any, i: number) => (
                                    <View key={i} style={styles.tableRow}>
                                        <Text style={styles.tableText}>{s.service}</Text>
                                        <Text style={[styles.tableText, { color: '#64748B' }]}>{s.crews || '-'}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>

                    <TouchableOpacity style={styles.printBtn} onPress={() => setModalVisible(false)}>
                        <Text style={styles.printBtnText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0066FF" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderCalendar()}
          
          <View style={styles.eventListTitle}>
            <Text style={styles.listHeader}>Ceremonies on {formatDisplayDateShort(selectedDate)}</Text>
          </View>

          {events.filter(e => e.start?.startsWith(selectedDate)).length === 0 ? (
            <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={48} color="#E2E8F0" />
                <Text style={styles.emptyText}>No ceremonies scheduled for this day</Text>
            </View>
          ) : (
            events.filter(e => e.start?.startsWith(selectedDate)).map((e, idx) => (
                <TouchableOpacity key={idx} style={styles.eventCard} onPress={() => {
                    setSelectedEvent(e);
                    setModalVisible(true);
                }}>
                    <View style={[styles.eventAccent, { backgroundColor: e.backgroundColor || '#0066FF' }]} />
                    <View style={styles.eventInfo}>
                        <Text style={styles.eventDate}>{formatDisplayDate(e.start)} • {e.extendedProps?.starttime || 'All Day'}</Text>
                        <Text style={styles.eventTitle}>{e.title}</Text>
                        <Text style={styles.eventVenue} numberOfLines={1}>
                            <Ionicons name="location" size={12} color="#64748B" /> {e.extendedProps?.venue || 'No Venue'}
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
      {renderEventDetails()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20, backgroundColor: '#FFFFFF' },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { padding: 5, marginLeft: -10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
  monthSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F1F5F9', borderRadius: 15, padding: 12 },
  monthLabel: { fontSize: 16, fontWeight: 'bold', color: '#0066FF' },
  scrollContent: { padding: 15 },
  calendarCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  weekHeaderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    backgroundColor: '#FFF5F0', // Light peach/orange background
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
  },
  weekHeaderLabel: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    color: '#0F172A', 
    width: (width - 40) / 7, 
    textAlign: 'center' 
  },
  weekRow: { flexDirection: 'row', justifyContent: 'flex-start' },
  dayCell: { 
    width: (width - 50) / 7, 
    height: 90, 
    alignItems: 'flex-start', 
    justifyContent: 'flex-start', 
    padding: 5,
    borderWidth: 0.5,
    borderColor: '#F1F5F9'
  },
  emptyDayCell: { backgroundColor: '#F8FAFC' },
  todayCell: { backgroundColor: '#F0F9FF' },
  selectedCell: { 
    backgroundColor: '#FFFFFF',
    borderColor: '#0066FF',
    borderWidth: 2,
    zIndex: 10,
  },
  dayText: { fontSize: 13, fontWeight: '600', color: '#94A3B8', marginBottom: 4 },
  todayText: { color: '#0066FF', fontWeight: 'bold' },
  selectedText: { color: '#0066FF', fontWeight: 'bold' },
  eventPillContainer: { width: '100%', gap: 4 },
  eventPill: { 
    width: '100%',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  eventPillText: { fontSize: 9, fontWeight: 'bold' },
  moreText: { fontSize: 9, color: '#94A3B8', textAlign: 'center', marginTop: 2 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  eventListTitle: { marginTop: 25, marginBottom: 15, paddingHorizontal: 5 },
  listHeader: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  eventCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 15, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5, elevation: 1 },
  eventAccent: { width: 4, height: '80%', borderRadius: 2, marginRight: 15 },
  eventInfo: { flex: 1 },
  eventDate: { fontSize: 12, color: '#64748B', fontWeight: '600', marginBottom: 4 },
  eventTitle: { fontSize: 15, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  eventVenue: { fontSize: 12, color: '#64748B' },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { color: '#94A3B8', marginTop: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: 40, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalCategory: { fontSize: 12, color: '#0066FF', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A', marginTop: 5 },
  closeBtn: { padding: 5 },
  modalBody: { padding: 25 },
  infoBlock: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconBox: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  infoLabel: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  infoValue: { fontSize: 16, color: '#0F172A', fontWeight: '600', marginTop: 2 },
  tableCard: { backgroundColor: '#FAFAFA', borderRadius: 15, padding: 15, marginTop: 10 },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 10, marginBottom: 10 },
  tableHeaderText: { fontSize: 12, fontWeight: 'bold', color: '#94A3B8' },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  tableText: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  printBtn: { backgroundColor: '#0066FF', margin: 25, paddingVertical: 15, borderRadius: 15, alignItems: 'center' },
  printBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }
});
