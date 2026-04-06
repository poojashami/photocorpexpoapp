import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions,
  ImageBackground
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F1F5F9']}
        style={styles.gradient}
      >
        <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000' }} 
            style={styles.bgImage}
            imageStyle={{ opacity: 0.05 }}
        >
            <View style={styles.content}>
                
                {/* Logo & Branding */}
                <Animated.View entering={FadeInDown.delay(300).duration(1000)} style={styles.logoContainer}>
                    <View style={[styles.logoOuter, { borderColor: '#0066FF' }]}>
                        <View style={styles.logoInner}>
                            <Text style={[styles.logoText, { color: '#0066FF' }]}>PC</Text>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(500).duration(1000)} style={styles.textContainer}>
                    <Text style={[styles.brandTitle, { color: '#0F172A' }]}>PhotoCorp</Text>
                    <Text style={styles.brandSubtitle}>STUDIO MANAGEMENT</Text>
                    <Text style={[styles.tagline, { color: '#64748B' }]}>
                        Streamline your entire photography workflow with our premium administrative dashboard.
                    </Text>
                </Animated.View>

                {/* Bottom Action Area */}
                <Animated.View entering={FadeIn.delay(1000).duration(800)} style={styles.actionContainer}>
                    <TouchableOpacity 
                        style={styles.loginBtn}
                        onPress={() => router.push('/(auth)')}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#0066FF', '#0044CC']}
                            style={styles.btnGradient}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                        >
                            <Text style={[styles.btnText, { color: '#FFF' }]}>Proceed to Login</Text>
                            <Ionicons name="arrow-forward" size={20} color="#FFF" />
                        </LinearGradient>
                    </TouchableOpacity>
                    
                    <Text style={styles.footerText}>By IndiCorp IT Solutions Pvt Ltd</Text>
                </Animated.View>

            </View>
        </ImageBackground>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.15,
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000040',
    shadowColor: '#D4AF37',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  logoInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  logoText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#000040',
    letterSpacing: -2,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  brandTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 2,
    marginBottom: 5,
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#D4AF37',
    letterSpacing: 4,
    fontWeight: '600',
    marginBottom: 20,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto',
  },
  loginBtn: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#D4AF37',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    marginBottom: 30,
  },
  btnGradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  btnText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
  }
});
