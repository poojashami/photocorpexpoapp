import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Enter Details');
      return;
    }
    // Hardcoded simple login
    if (email === 'admin' && password === 'admin') {
      router.replace('/(tabs)');
    } else {
       router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000060', '#000020']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Aperture Logo Design */}
          <View style={styles.logoOuter}>
             <View style={styles.logoInner}>
                <Text style={styles.logoText}>PC</Text>
             </View>
          </View>
          
          <Text style={styles.brandTitle}>PhotoCorp</Text>
          <Text style={styles.tagline}>BY INDICORP IT SOLUTIONS</Text>

          {/* Ribbon from screenshot */}
          <View style={styles.ribbonContainer}>
             <View style={styles.ribbonGoldBorder} />
             <LinearGradient 
                colors={['#0033CC', '#0066FF', '#0033CC']} 
                start={{x: 0, y: 0}} 
                end={{x: 1, y: 0}}
                style={styles.ribbonMain} 
             />
             <View style={styles.ribbonGoldBorder} />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>SIGN IN</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerCompany}>By IndiCorp IT Solutions Pvt Ltd</Text>
        </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  logoOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000040',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  logoInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#000040',
    letterSpacing: -2,
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 2,
    marginBottom: 40,
  },
  ribbonContainer: {
    width: '120%',
    height: 45,
    marginVertical: 30,
  },
  ribbonGoldBorder: {
    height: 3,
    backgroundColor: '#D4AF37',
  },
  ribbonMain: {
    flex: 1,
  },
  inputContainer: {
    width: '100%',
    marginTop: 20,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#FFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  button: {
    backgroundColor: '#D4AF37',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  footerCompany: {
    position: 'absolute',
    bottom: 40,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  }
});
