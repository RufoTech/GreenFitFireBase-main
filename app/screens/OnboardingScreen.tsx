import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  Platform,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get('window');

// Ekran Verileri (Data)
const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Achieve Your',
    titleHighlight: 'Best Self',
    subtitle: 'Personalized workouts and nutrition plans tailored to your goals.',
    translation: 'Hədəflərinizə uyğunlaşdırılmış fərdi məşqlər və qidalanma planları.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7236VWt1O-mgBfKIU3HOr5UUWtGYmN4DW4chYtZJwwDac6Kmeouq0cSv90sc7Xnu9XVwbRoT2aNEzG_XKWCjjuZoyn-b7-bgXJS1yrpN1ngOmf6rvMH3yIYZxCNYtx0KRmZHHXZuZjIz8DQ5BGjJu9Fk6ZPYp_tpM5n1t1G94sRVkpScrxmODjR-22bN_GJAo5JhRmmMczYg-KswF6XVJjxkwZLXkcqDcuKdD1dWZPWn3x9zZKNvsr1b4TpGHcxAP9nnFWs5zRzs',
  },
  {
    id: '2',
    title: 'Push Your Limits',
    subtitle: 'Hər məşq sizi hədəfə bir addım daha yaxınlaşdırır.',
    translation: 'Every workout brings you one step closer to your goal.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqnAcIA3uJQ4T9y0242FPA5SPsG0bKOXlIrA-trYjMA_PWxtD5p15DiNSTq02ZQ-KSyJCbIGNKI4smSPeCgagkBjrBEQoaDhaIwJMIpeHQ0dwh8lSH2ntCtBp47LWbSQeuF4JBJ_hPkZOEDdS3jSlCM3M2G4SNKyFzd3QmbgIOzhZpQo3C06977bPEFW2g0fSlNhn82dHIc8rDR8RDlz7IE_VEAMpUWOZ_qfMu2bpfGTldkWTr733hmwY1sLgOH3cksevgLCEdFPI',
  },
  {
    id: '3',
    title: 'Start Your',
    titleHighlight: 'Journey Today',
    subtitle: 'Join our community and transform your life.',
    translation: 'İcmamıza qoşulun və həyatınızı dəyişdirin.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop', // 3. sayfa için örnek resim
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Fontları yükle
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const handleSkip = () => {
    router.replace('/login');
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleSkip();
    }
  };

  // Kaydırma olayını dinle
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  // Her bir sayfanın tasarımı
  const renderItem = ({ item }: { item: typeof ONBOARDING_DATA[0] }) => {
    return (
      <View style={styles.slide}>
        {/* Şəkil Konteyneri */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="cover"
          />
          {/* Qradiyent Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(31,35,15,0.6)', colors.backgroundDark]}
            style={styles.gradient}
          />
        </View>

        {/* Tipoqrafiya */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {item.title.includes('Limitləri') ? item.title + ' / ' : item.title + ' '}
            <Text style={[styles.titleHighlight, item.title.includes('Limitləri') && { fontStyle: 'italic' }]}>
              {item.titleHighlight}
            </Text>
          </Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
          {item.translation && (
            <Text style={styles.translation}>{item.translation}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.backgroundDark} />

      {/* Üst Header / Skip düyməsi */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.skipButton} 
          activeOpacity={0.7}
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Kaydırılabilir Liste (FlatList) */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
      />

      {/* Alt Hissə (Səhifələmə və Düymə) */}
      <View style={styles.footer}>
        {/* Səhifələmə indikatorları (Pagination) */}
        <View style={styles.pagination}>
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Next Düyməsi (CTA Button) */}
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <MaterialIcons name="arrow-forward" size={24} color={colors.backgroundDark} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
    position: 'absolute', // Header'ı sabit tutmak için
    top: Platform.OS === 'android' ? 25 : 0,
    right: 0,
    width: '100%',
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: colors.textSecondary,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  slide: {
    width: width, // Her slayt ekran genişliğinde olmalı
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  imageContainer: {
    width: width,
    height: height * 0.65, // Ekranın %65'ini kaplasın
    marginBottom: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%', // Gradient yüksekliğini artırdım
  },
  textContainer: {
    width: width,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: -40, // Metni biraz yukarı çekmek için
  },
  title: {
    color: colors.textMain,
    fontSize: 32,
    fontFamily: 'Inter_800ExtraBold',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 16,
  },
  titleHighlight: {
    color: colors.primary,
    fontFamily: 'Inter_800ExtraBold',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 8,
    maxWidth: '90%',
  },
  translation: {
    color: colors.textMuted,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
    textAlign: 'center',
    maxWidth: '85%',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 32,
    paddingTop: 16,
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 32,
    backgroundColor: colors.primary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // colors.dotInactive yerine daha şeffaf bir renk
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: colors.backgroundDark,
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
});
