import React, { useEffect, useRef, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Animated, 
  Dimensions, 
  TouchableOpacity, 
  ScrollView, 
  TouchableWithoutFeedback,
  Platform,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMenu } from '../context/MenuContext';
import { Colors } from '../constants/theme';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Storage } from '../utils/storage';
import { Alert } from 'react-native';

const API_BASE_URL = 'http://10.64.185.100:8000/api';

const { width, height } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

// Accordion Component for Submenus
const MenuItem = ({ icon, label, children, isNested = false, onPress }: any) => {
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    if (children) {
      setExpanded(!expanded);
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <View style={styles.menuItemContainer}>
      <TouchableOpacity 
        style={[styles.menuItem, isNested && styles.nestedMenuItem]} 
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.menuLeft}>
          {icon && <Ionicons name={icon} size={isNested ? 18 : 22} color="#D4AF37" style={styles.menuIcon} />}
          <Text style={[styles.menuText, { fontSize: isNested ? 14 : 16 }]}>{label}</Text>
        </View>
        {children && (
          <Ionicons 
            name={expanded ? "chevron-down" : "chevron-forward"} 
            size={18} 
            color="#888" 
          />
        )}
      </TouchableOpacity>
      {expanded && children && (
        <View style={styles.submenuContainer}>
          {children}
        </View>
      )}
    </View>
  );
};

export const SidebarOverlay = () => {
  const { isMenuOpen, closeMenu } = useMenu();
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    if (isMenuOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isMenuOpen]);

  // The view remains rendered but pointerEvents controls interactability.

  const navigateTo = (path: any) => {
      closeMenu();
      router.push(path);
  }

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Kya aap logout karna chahte hain?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await Storage.clear();
            closeMenu();
            try {
              const token = await Storage.getItem('userToken');
              if (token) {
                axios.post(`${API_BASE_URL}/user/logout`, {}, {
                  headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                  },
                }).catch(() => {}); // fire-and-forget
              }
            } catch (e) {}
            // Reset entire navigation stack to login page
            router.dismissAll();
            router.replace('/(auth)');
          },
        },
      ]
    );
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={isMenuOpen ? "auto" : "none"}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={closeMenu}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      {/* Sidebar Panel */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.header}>
            <View style={styles.logoCont}>
                <Text style={styles.logoText}>PC</Text>
            </View>
            <Text style={styles.headerTitle}>PhotoCorp Admin</Text>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Dashboard */}
          <MenuItem 
            icon="grid" 
            label="Dashboard" 
            onPress={() => navigateTo('/(tabs)')} 
          />

          {/* Enquiry */}
          <MenuItem 
            icon="mail" 
            label="Enquiry" 
            onPress={() => navigateTo('/(tabs)/enquiries')} 
          />

          {/* Quotation */}
          <MenuItem icon="document-text" label="Quotation">
            <MenuItem icon="id-card" label="Enquiry Reference" isNested onPress={() => {}} />
            <MenuItem icon="person-remove" label="Without Reference" isNested onPress={() => {}} />
          </MenuItem>

          {/* Event Booking */}
          <MenuItem icon="calendar" label="Event Booking">
            <MenuItem icon="person-remove" label="Without Reference" isNested onPress={() => {}} />
            <MenuItem icon="link" label="With Reference" isNested>
                <MenuItem icon="help-circle" label="Enquiry" isNested onPress={() => {}} />
                <MenuItem icon="receipt" label="Quotation" isNested onPress={() => {}} />
            </MenuItem>
          </MenuItem>

          {/* Calendar */}
          <MenuItem icon="calendar-outline" label="Calendar" onPress={() => navigateTo('/(tabs)/schedule')} />
          
          {/* Expense/Income */}
          <MenuItem icon="wallet" label="Expense/Income">
              <MenuItem icon="cash" label="Create" isNested />
              <MenuItem icon="document" label="Report" isNested />
          </MenuItem>

          {/* Account */}
          <MenuItem icon="person-circle" label="Account" onPress={() => {}} />

          {/* Reports */}
          <MenuItem icon="folder-open" label="Reports">
             <MenuItem icon="clipboard" label="Crew Reports" isNested />
             <MenuItem icon="calendar" label="Crew Ceremony" isNested />
             <MenuItem icon="calendar" label="Crew Event" isNested />
             <MenuItem icon="people" label="Customer Reports" isNested />
             <MenuItem icon="document-text" label="Enquiry Reports" isNested onPress={() => navigateTo('/enquiry-report')} />
             <MenuItem icon="analytics" label="Event Reports" isNested />
             <MenuItem icon="pie-chart" label="Profit Loss Reports" isNested />
             <MenuItem icon="document" label="Quotation Reports" isNested />
          </MenuItem>

          <View style={{ height: 60 }} />
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 10,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#000040',
    zIndex: 11,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    borderRightWidth: 1,
    borderRightColor: '#D4AF37',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.3)',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoCont: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000040',
    letterSpacing: -1,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scroll: {
    flex: 1,
  },
  menuItemContainer: {
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  nestedMenuItem: {
    paddingVertical: 12,
    paddingLeft: 45,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderBottomWidth: 0,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    color: '#E0E0E0',
    fontWeight: '500',
  },
  submenuContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 75, 75, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 75, 75, 0.3)',
  },
  logoutText: {
    color: '#FF4B4B',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
  },
});
