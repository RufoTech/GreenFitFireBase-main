import { colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSendResetLink = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    // Implement password reset logic here
    Alert.alert('Success', 'Password reset link sent to your email');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.backgroundDark} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header / Back Button */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backButton}
              accessibilityLabel="Go back"
            >
              <MaterialIcons name="arrow-back" size={28} color={colors.textMain} />
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>
                Forgot {'\n'}
                <Text style={styles.titleHighlight}>Password</Text>
              </Text>
              <Text style={styles.description}>
                Enter your email address to receive a password reset link
              </Text>
            </View>

            {/* Image/Visual Element */}
            <View style={styles.imageContainer}>
              <View style={styles.imageOverlay} />
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-w6WSr7rGlb5LdVKUEr6lyY1AhW1sF8_NyzkAjoO9BKGEVnZFM_npA5Y_Mc7F39Ke7Hn15o9A8aSuqEZw23L_R011Vs3rs5tvT4VN_EznGyg421e8xgOcsdLrK1GjFbH5cndUvCDvzge-vYx2ponKOFeKhiSPO51nQtQOOnK_3LGUkLLQw061bn5xABneE7IXCnnW92k8ZVBWEHm2EKrs5XjUNMLf6ZxdtXe6iYs9sfyeAkP4Fo1YG2hQjYpEU1H1gzLE43RvszE' }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="mail" size={24} color={colors.textMuted} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input}
                    placeholder="yourname@email.com"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity 
                style={styles.submitButton}
                activeOpacity={0.9}
                onPress={handleSendResetLink}
              >
                <Text style={styles.submitButtonText}>Send Reset Link</Text>
                <MaterialIcons name="send" size={20} color={colors.backgroundDark} />
              </TouchableOpacity>
            </View>

            {/* Footer Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Remember your password? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </View>

          </View>

          {/* Decorative Elements (simulated with absolute views if needed, but keeping clean for now as per RN best practices) */}
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    paddingVertical: 16,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 8,
    marginLeft: -8, // Align icon with content
  },
  mainContent: {
    flex: 1,
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  titleSection: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.textMain,
    lineHeight: 48,
    fontFamily: 'Inter_700Bold',
  },
  titleHighlight: {
    color: colors.primary,
  },
  description: {
    fontSize: 18,
    color: colors.textMuted, // Using muted for description as per theme usage, or closer to slate-400
    marginTop: 16,
    lineHeight: 28,
    fontFamily: 'Inter_400Regular',
  },
  imageContainer: {
    width: '100%',
    height: 192, // 48 * 4
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 24,
    position: 'relative',
    backgroundColor: '#1e293b', // Placeholder bg
  },
  image: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(204, 255, 0, 0.1)', // primary/20
    zIndex: 1,
  },
  formSection: {
    gap: 24,
    paddingVertical: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMain,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Inter_600SemiBold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // slate-800/50 approx
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    // In RN we handle focus styling via state if needed, simplified here
  },
  inputIcon: {
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    color: colors.textMain,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  submitButtonText: {
    color: colors.backgroundDark,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
  },
  footer: {
    marginTop: 'auto',
    paddingVertical: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  loginLink: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
    fontFamily: 'Inter_700Bold',
  },
});
