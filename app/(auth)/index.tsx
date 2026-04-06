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
import axios from 'axios';
import { Storage } from '../../utils/storage';
import { Config } from '../../constants/Config';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your username and password');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(Config.LOGIN_URL, {
        email: email,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('API Response:', response.data);

      if (response.data.status == "200" || response.data.status == 200) {
        await Storage.setItem('userToken', response.data.token);
        await Storage.setItem('userData', JSON.stringify(response.data.user));
        await Storage.setItem('companyId', String(response.data.user.company_id));
        if (response.data.menuIds) {
          await Storage.setItem('menuIds', JSON.stringify(response.data.menuIds));
        }
        setTimeout(() => { router.replace('/(tabs)'); }, 100);
      } else {
        Alert.alert('Login Failed', response.data.message || 'Invalid credentials');
      }
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Connection failed. Please check if your server is running.';
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#E2E8F0']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Aperture Logo Design */}
          <View style={[styles.logoOuter, { borderColor: '#0066FF' }]}>
             <View style={styles.logoInner}>
                <Text style={[styles.logoText, { color: '#0066FF' }]}>PC</Text>
             </View>
          </View>
          
          <Text style={[styles.brandTitle, { color: '#0F172A' }]}>PhotoCorp</Text>
          <Text style={[styles.tagline, { color: '#64748B' }]}>BY INDICORP IT SOLUTIONS</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: '#FFF', color: '#000', borderColor: '#E2E8F0' }]}
              placeholder="Username"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.input, { backgroundColor: '#FFF', color: '#000', borderColor: '#E2E8F0' }]}
              placeholder="Password"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#0066FF' }, loading && { opacity: 0.7 }]} 
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={[styles.buttonText, { color: '#FFF' }]}>{loading ? 'SIGNING IN...' : 'SIGN IN'}</Text>
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
