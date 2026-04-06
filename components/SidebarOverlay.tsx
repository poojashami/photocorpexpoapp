import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions, 
  ScrollView, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useMenu } from '../context/MenuContext';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

export const SidebarOverlay = () => {
  const { isMenuOpen, closeMenu } = useMenu();
  const router = useRouter();

  const theme = {
    background: '#FFFFFF',
    text: '#0F172A',
    tint: '#0066FF',
    border: '#F1F5F9',
    activeBg: '#E6F0FF',
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withTiming(isMenuOpen ? 0 : -SIDEBAR_WIDTH, { duration: 400 }) }
      ],
    };
  });

  const navigateTo = (path: any) => {
    closeMenu();
    router.push(path);
  };

  const MenuItem = ({ icon, label, onPress, children, isNested = false }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = !!children;

    const handlePress = () => {
      if (hasChildren) {
        setIsOpen(!isOpen);
      } else if (onPress) {
        onPress();
      }
    };

    return (
      <View style={styles.menuItemContainer}>
        <TouchableOpacity 
          style={[
            styles.menuItem, 
            isNested && styles.nestedMenuItem,
            isOpen && !isNested && { backgroundColor: theme.activeBg }
          ]} 
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <Ionicons 
                name={icon as any} 
                size={isNested ? 18 : 22} 
                color={theme.tint} 
                style={styles.menuIcon} 
            />
            <Text style={[
              styles.menuText, 
              { color: theme.text, fontSize: isNested ? 14 : 15 }
            ]}>
              {label}
            </Text>
          </View>
          {hasChildren && (
            <Ionicons 
              name={isOpen ? "chevron-down" : "chevron-forward"} 
              size={18} 
              color={theme.tint} 
            />
          )}
        </TouchableOpacity>
        {isOpen && hasChildren && (
          <View style={{ backgroundColor: '#F8FAFC' }}>
            {children}
          </View>
        )}
      </View>
    );
  };

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isMenuOpen ? 1 : 0, { duration: 400 }),
    };
  });

  return (
    <Animated.View 
      style={[styles.backdrop, backdropStyle]} 
      pointerEvents={isMenuOpen ? 'auto' : 'none'}
    >
      <TouchableOpacity 
        style={StyleSheet.absoluteFill} 
        onPress={closeMenu} 
        activeOpacity={1} 
      />
      <Animated.View style={[styles.sidebar, { backgroundColor: theme.background, borderColor: theme.border }, animatedStyle]}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <View style={[styles.logoCont, { borderColor: theme.tint }]}>
            <Text style={[styles.logoText, { color: theme.tint }]}>PC</Text>
          </View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>PhotoCorp Studio</Text>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <MenuItem icon="grid" label="Dashboard" onPress={() => navigateTo('/(tabs)')} />
          
          <MenuItem icon="people" label="Customers">
              <MenuItem icon="add-circle" label="Add New" isNested />
              <MenuItem icon="people" label="Directory" isNested onPress={() => navigateTo('/customer-report')} />
          </MenuItem>

          <MenuItem icon="document-text" label="Enquiries">
              <MenuItem icon="create" label="New Enquiry" isNested />
              <MenuItem icon="list" label="All Enquiries" isNested onPress={() => navigateTo('/enquiry-report')} />
          </MenuItem>

          <MenuItem icon="calendar" label="Bookings">
              <MenuItem icon="calendar" label="Calendar" isNested onPress={() => navigateTo('/(tabs)/booking')} />
              <MenuItem icon="document" label="Quotations" isNested onPress={() => navigateTo('/quotation-report')} />
          </MenuItem>

          <MenuItem icon="camera" label="Events">
              <MenuItem icon="list" label="Event List" isNested onPress={() => navigateTo('/event-report')} />
              <MenuItem icon="add" label="New Event" isNested />
          </MenuItem>

          <MenuItem icon="wallet" label="Financials">
              <MenuItem icon="cash" label="Profit & Loss" isNested onPress={() => navigateTo('/profit-loss-report')} />
          </MenuItem>

          <MenuItem icon="folder" label="Reports Sub-Menu">
             <MenuItem icon="people-circle" label="Crew Reports" isNested onPress={() => navigateTo('/crew-report')} />
             <MenuItem icon="calendar" label="Ceremony Reports" isNested onPress={() => navigateTo('/crew-ceremony-report')} />
             <MenuItem icon="camera" label="Event Details" isNested onPress={() => navigateTo('/crew-event-report')} />
          </MenuItem>

          <View style={{ height: 60 }} />
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 10,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    zIndex: 11,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    borderRightWidth: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    alignItems: 'center',
    marginBottom: 10,
  },
  logoCont: {
    width: 60,
    height: 60,
    borderRadius: 18,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
  },
  headerTitle: {
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
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  nestedMenuItem: {
    paddingVertical: 12,
    paddingLeft: 45,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontWeight: '600',
  },
});
