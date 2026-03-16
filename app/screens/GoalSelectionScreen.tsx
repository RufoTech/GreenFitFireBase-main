import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  ImageBackground
} from 'react-native';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Hədəf məlumatları
const goals = [
  {
    id: 'weight_loss',
    title: 'Lose Weight',
    icon: 'fitness-center', // MaterialIcons
    iconLib: 'MaterialIcons',
    bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXnNu83e2klFRw2X6pXr29aAU1JZCnmBEQ7mafMOUNIYfGeNV4J6shdvRYd0clMdCTnwKjRrSePvkmT-oDX33ryWUrMOdNpFpPlq83NxG-K1sbVDEFAopC41DZhL7PkqkgD2UBXkn09vah2QUiwI5PE-uTNRBxAzMChtFp4jgJSMTTJFZwK9X0_FToBFMTRrNgqdbrHwDvOJo0Qy_mCrTAgApA-rRcncepLC5CLMBIs7kNQ69inwU8fEqZ-yf13nbfDj7xh_MkL2k"
  },
  {
    id: 'gain_muscle',
    title: 'Gain Muscle',
    icon: 'activity', // Feather
    iconLib: 'Feather',
    bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9E6NfMrjuYEIyk5UVaNCa0jHaDstQ9kDmxZZc0_hx-T16QDPUh1SaAi0ROM7oaOHENdqa4I4LNuqjSqngiD3TuOzrd8zET_IC6jIFZjoOZooPCDp7uaT_XPF3tkoDqHo2b4Xysk1C3y3dfpwQgIAUwhicmHchK9WYK5el0ZF89GDj8hwL6bG1U1fwr9Yo86Rs72nDhOL5QmomLaFtROb3WTtUbVSx83qeZ8bNO3_OZbuw7_rKGiuoBleaUbDbbV4kqU2CPVroRL8"
  },
  {
    id: 'get_fitter',
    title: 'Get Fitter',
    icon: 'local-fire-department', // MaterialIcons
    iconLib: 'MaterialIcons',
    bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMvkJcD0sPUEJLXm1-lfc0ZDvPKtwkJBKAd9X2wmTkzw6OHQhPXn_mmpKOoSDJJy7LPclGvMiPC5t9SV8uz_KskcnAuftXp1PsSWT2-VsDTcHSzE1CoF1IFAq5KzHfxdtsMWEHGQNXQLpEJii79blw_3fikBgMTrBxmXwE7mWu_6xZKysryQ0F2zw7sNVg3SCZ9o3_SFsMYOzxPJTpcbozZhr0dr9W3cNJKcX7RXCYHNkCL3_-5ibJy8SMt2yKSvyufUcAhtnnlz8"
  },
  {
    id: 'get_stronger',
    title: 'Get Stronger',
    icon: 'flash', // Ionicons
    iconLib: 'Ionicons',
    bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBx-xRVIYykSuAmjQtQZT62MsZ3qbmb185sCRscnb4NDXUgWwo0YBtsknvyYaHr5YXHh1oSNdBId2zcuwA55ifXbhmqjxLDkHA6Md4XWDfqSJZ4iBXp3hhk2tfl3JoiVwhgbWYDVBc4b1k9hzQOS2nuh8bcLJ-vgXBFBHZ4yHf3v94LxLSkRUaaqIP5ogtadyx0m7waIwMUqfdTc-HKguDTCeRx4KGilrMwFIfODDruyzh9tkG47mRl409rdwtaiTJwKyKonOjxUPc"
  }
];

export default function GoalSelectionScreen() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState('weight_loss');

  const renderIcon = (iconName, lib, isSelected) => {
    const color = isSelected ? '#1f230f' : '#ccff00';
    const size = 28;

    if (lib === 'MaterialIcons') return <MaterialIcons name={iconName} size={size} color={color} />;
    if (lib === 'Feather') return <Feather name={iconName} size={size} color={color} />;
    if (lib === 'Ionicons') return <Ionicons name={iconName} size={size} color={color} />;
    return null;
  };

  const handleNext = () => {
    router.push('/screens/LocationSelectionScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1f230f" />
      
      {/* Üst Naviqasiya - Tamamen temizlendi, sadece başlık kaldı */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Addis Fitness</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* İrəliləyiş Zolağı */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text style={styles.stepText}>STEP 1</Text>
            <Text style={styles.percentText}>25%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '25%' }]} />
          </View>
        </View>

        {/* Başlıq */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>
            What is Your Goal?
          </Text>
          <Text style={styles.description}>
            Help us prepare the most suitable plan for you.
          </Text>
        </View>

        {/* Hədəf Seçim Kartları */}
        <View style={styles.cardsContainer}>
          {goals.map((goal) => {
            const isSelected = selectedGoal === goal.id;
            
            return (
              <TouchableOpacity
                key={goal.id}
                onPress={() => setSelectedGoal(goal.id)}
                activeOpacity={0.9}
                style={[
                  styles.card,
                  isSelected ? styles.cardSelected : styles.cardUnselected
                ]}
              >
                <View style={styles.cardContent}>
                  <View style={[
                    styles.iconContainer,
                    isSelected ? styles.iconContainerSelected : styles.iconContainerUnselected
                  ]}>
                    {renderIcon(goal.icon, goal.iconLib, isSelected)}
                  </View>
                  
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>{goal.title}</Text>
                  </View>

                  <View style={styles.checkIconContainer}>
                    {isSelected ? (
                      <MaterialIcons name="check-circle" size={24} color="#ccff00" />
                    ) : (
                      <MaterialIcons name="radio-button-unchecked" size={24} color="#475569" />
                    )}
                  </View>
                </View>

                {/* Background Image Overlay */}
                <ImageBackground
                  source={{ uri: goal.bgImage }}
                  style={StyleSheet.absoluteFillObject}
                  imageStyle={{ borderRadius: 12, opacity: isSelected ? 0.4 : 0.2 }}
                />
                
                {/* Dark Overlay for better text readability */}
                <View style={[
                  StyleSheet.absoluteFillObject, 
                  { backgroundColor: '#1e293b', opacity: 0.6, borderRadius: 12, zIndex: -1 }
                ]} />
              </TouchableOpacity>
            );
          })}
        </View>
        
        {/* Bottom Padding for scroll */}
        <View style={{ height: 100 }} />

      </ScrollView>

      {/* Aşağı Fəaliyyət Düyməsi - Fixed Bottom */}
      <LinearGradient
        colors={['transparent', '#1f230f', '#1f230f']}
        locations={[0, 0.3, 1]}
        style={styles.footer}
      >
        <TouchableOpacity 
          style={styles.nextButton}
          activeOpacity={0.8}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <MaterialIcons name="arrow-forward" size={24} color="#1f230f" />
        </TouchableOpacity>
      </LinearGradient>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f230f',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Sadece başlık olduğu için ortaladık
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  // backButton stili silindi
  headerTitle: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  content: {
    paddingHorizontal: 16,
  },
  progressContainer: {
    marginVertical: 16,
    gap: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  stepText: {
    color: '#ccff00',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  percentText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
  progressBarBg: {
    height: 6,
    width: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ccff00',
    borderRadius: 3,
  },
  titleContainer: {
    paddingVertical: 24,
  },
  mainTitle: {
    color: '#f1f5f9',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  subTitle: {
    color: 'rgba(204, 255, 0, 0.9)',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
    marginBottom: 12,
  },
  description: {
    color: '#94a3b8',
    fontSize: 16,
    lineHeight: 22,
  },
  descriptionEn: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
    opacity: 0.7,
    marginTop: 4,
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    height: 90, // Sabit yükseklik
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  cardSelected: {
    borderColor: '#ccff00',
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
  },
  cardUnselected: {
    borderColor: 'rgba(51, 65, 85, 0.5)',
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
    height: '100%',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainerSelected: {
    backgroundColor: '#ccff00',
  },
  iconContainerUnselected: {
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
  },
  checkIconContainer: {
    marginLeft: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 48,
  },
  nextButton: {
    backgroundColor: '#ccff00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#ccff00",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    color: '#1f230f',
    fontSize: 18,
    fontWeight: '800',
  },
});
