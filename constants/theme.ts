/**
 * PhotoCorp Royal Theme Configuration
 * Deep Blue, Gold, and Silver accents
 */

const tintColorLight = '#D4AF37';
const tintColorDark = '#D4AF37';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    card: '#F5F5F5',
    border: '#E0E0E0',
    tabBar: '#FFFFFF',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000040', // Deep Navy Blue
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    card: '#000060', // Slightly lighter blue for cards
    border: '#D4AF37', // Gold for borders
    tabBar: '#000030', // Very deep blue
  },
};

export const Fonts = {
    regular: 'System',
    bold: 'System',
    rounded: 'System',
};
