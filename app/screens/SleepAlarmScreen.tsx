import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PRIMARY = "#ccff00";
const BG_DARK = "#0a0b05";
const { width } = Dimensions.get('window');

const bars = [0.5, 0.75, 1, 0.66, 0.33, 0.8, 0.2, 0.5, 0.83];
const barOpacities = [0.2, 0.4, 1, 0.6, 0.3, 1, 0.1, 0.5, 1];

const pad = (n: number) => String(n).padStart(2, "0");

export default function SleepAlarmScreen() {
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);
  const [isPM, setIsPM] = useState(false);
  const [smartAlarm, setSmartAlarm] = useState(true);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(10,11,5,0.85)" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={PRIMARY} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Sleep & Alarm</Text>
          <Text style={styles.headerSubtitle}>Yuxu və Zəng</Text>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="settings" size={24} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Time Picker */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Set Wake Up Time</Text>
                <Text style={styles.sectionSubtitle}>Oyanış vaxtını təyin edin</Text>
            </View>

            <View style={styles.timePickerContainer}>
                {/* Glow Effect (Simulated with background color and opacity) */}
                <View style={styles.glowEffect} />

                {/* Hour */}
                <View style={styles.timeColumn}>
                    <TouchableOpacity onPress={() => setHour((h) => (h % 12) + 1)} style={styles.arrowBtn}>
                        <MaterialIcons name="expand-less" size={32} color="#475569" />
                    </TouchableOpacity>
                    <Text style={styles.timeDisplay}>{pad(hour)}</Text>
                    <TouchableOpacity onPress={() => setHour((h) => h === 1 ? 12 : h - 1)} style={styles.arrowBtn}>
                        <MaterialIcons name="expand-more" size={32} color="#475569" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.timeSeparator}>:</Text>

                {/* Minute */}
                <View style={styles.timeColumn}>
                    <TouchableOpacity onPress={() => setMinute((m) => (m + 1) % 60)} style={styles.arrowBtn}>
                        <MaterialIcons name="expand-less" size={32} color="#475569" />
                    </TouchableOpacity>
                    <Text style={styles.timeDisplay}>{pad(minute)}</Text>
                    <TouchableOpacity onPress={() => setMinute((m) => (m + 59) % 60)} style={styles.arrowBtn}>
                        <MaterialIcons name="expand-more" size={32} color="#475569" />
                    </TouchableOpacity>
                </View>

                {/* AM/PM */}
                <View style={styles.amPmColumn}>
                    <TouchableOpacity 
                        onPress={() => setIsPM(false)} 
                        style={[styles.amPmButton, !isPM && styles.amPmButtonActive]}
                    >
                        <Text style={[styles.amPmText, !isPM && styles.amPmTextActive]}>AM</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setIsPM(true)} 
                        style={[styles.amPmButton, isPM && styles.amPmButtonActive]}
                    >
                        <Text style={[styles.amPmText, isPM && styles.amPmTextActive]}>PM</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
            {[ 
                { icon: "track-changes", label: "Target / Hədəf", value: "8h 00m" }, 
                { icon: "history", label: "Actual / Faktiki", value: "7h 15m" }, 
            ].map((item) => (
                <View key={item.label} style={styles.statCard}>
                    <View style={styles.statHeader}>
                        <MaterialIcons name={item.icon as any} size={14} color={PRIMARY} />
                        <Text style={styles.statLabel}>{item.label}</Text>
                    </View>
                    <Text style={styles.statValue}>{item.value}</Text>
                </View>
            ))}
        </View>

        {/* Sleep Quality */}
        <View style={styles.section}>
            <View style={styles.qualityHeader}>
                <View>
                    <Text style={styles.sectionTitle}>Sleep Quality</Text>
                    <Text style={styles.sectionSubtitle}>Yuxu Keyfiyyəti Analizi</Text>
                </View>
                <Text style={styles.qualityScore}>84% Excellent</Text>
            </View>

            <View style={styles.chartContainer}>
                {bars.map((h, i) => (
                    <View key={i} style={[
                        styles.bar, 
                        { height: `${h * 100}%`, backgroundColor: `rgba(204,255,0,${barOpacities[i]})` }
                    ]} />
                ))}
            </View>

            <View style={styles.legendContainer}>
                {[ 
                    { label: "Deep / Dərin", opacity: 1 }, 
                    { label: "Light / Yüngül", opacity: 0.6 }, 
                    { label: "REM", opacity: 0.3 }, 
                    { label: "Awake / Oyanıq", opacity: 0.1 }, 
                ].map((item) => (
                    <View key={item.label} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: `rgba(204,255,0,${item.opacity})` }]} />
                        <Text style={styles.legendText}>{item.label}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* Smart Alarm */}
        <View style={styles.smartAlarmSection}>
            <TouchableOpacity 
                style={styles.smartAlarmCard}
                activeOpacity={0.9}
                onPress={() => setSmartAlarm(!smartAlarm)}
            >
                <View>
                    <View style={styles.smartAlarmHeader}>
                        <MaterialIcons name="alarm" size={20} color={BG_DARK} />
                        <Text style={styles.smartAlarmTitle}>Smart Alarm</Text>
                    </View>
                    <Text style={styles.smartAlarmSubtitle}>Ağıllı Oyanış Zəngi</Text>
                </View>
                <View style={styles.toggleSwitch}>
                    <View style={[
                        styles.toggleKnob, 
                        smartAlarm ? { transform: [{ translateX: 24 }] } : { transform: [{ translateX: 0 }] }
                    ]} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.soundCard}>
                <View style={styles.soundLeft}>
                    <View style={styles.soundIconContainer}>
                        <MaterialIcons name="music-note" size={20} color={PRIMARY} />
                    </View>
                    <View>
                        <Text style={styles.soundTitle}>Alarm Sound | Zəng Səsi</Text>
                        <Text style={styles.soundSubtitle}>Forest Rain (Default)</Text>
                    </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#64748b" />
            </TouchableOpacity>
        </View>

        {/* Sleep Hygiene Tips */}
        <View style={styles.section}>
            <Text style={styles.tipsTitle}>Sleep Hygiene | Yuxu Gigiyenası</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tipsContainer}>
                {[ 
                    { 
                        icon: "lightbulb", 
                        title: "No Screen Time", 
                        desc: "Avoid blue light 1 hour before bed to increase melatonin production naturally.", 
                        sub: "Ekran vaxtını məhdudlaşdırın", 
                    }, 
                    { 
                        icon: "thermostat", 
                        title: "Cool Environment", 
                        desc: "Keep your bedroom temperature around 18°C for the best quality deep sleep.", 
                        sub: "Sərin mühit yaradın", 
                    }, 
                ].map((tip) => (
                    <View key={tip.title} style={styles.tipCard}>
                        <MaterialIcons name={tip.icon as any} size={24} color={PRIMARY} style={{ marginBottom: 12 }} />
                        <Text style={styles.tipTitle}>{tip.title}</Text>
                        <Text style={styles.tipDesc}>{tip.desc}</Text>
                        <Text style={styles.tipSub}>{tip.sub}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_DARK,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(10,11,5,0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(204,255,0,0.1)',
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(204,255,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  headerSubtitle: {
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: 'rgba(204,255,0,0.7)',
  },
  scrollContent: {
    paddingTop: 70, // Space for header
    paddingBottom: 32,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15,23,42,0.3)',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(30,41,59,0.5)',
    position: 'relative',
    overflow: 'hidden',
  },
  glowEffect: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 128,
    height: 128,
    backgroundColor: 'rgba(204,255,0,0.1)',
    borderRadius: 64,
  },
  timeColumn: {
    alignItems: 'center',
    gap: 8,
  },
  arrowBtn: {
    padding: 0,
  },
  timeDisplay: {
    fontSize: 64,
    fontWeight: '900',
    color: PRIMARY,
    lineHeight: 70,
    fontVariant: ['tabular-nums'],
  },
  timeSeparator: {
    fontSize: 48,
    fontWeight: '900',
    color: 'rgba(204,255,0,0.3)',
    marginBottom: 8,
    marginHorizontal: 16,
  },
  amPmColumn: {
    marginLeft: 16,
    gap: 8,
  },
  amPmButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1e293b',
  },
  amPmButtonActive: {
    backgroundColor: PRIMARY,
  },
  amPmText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
  },
  amPmTextActive: {
    color: BG_DARK,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.5)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 8,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94a3b8',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  qualityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  qualityScore: {
    color: PRIMARY,
    fontWeight: '700',
    fontSize: 14,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 128,
    backgroundColor: 'rgba(15,23,42,0.3)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(30,41,59,0.5)',
  },
  bar: {
    flex: 1,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 4,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  smartAlarmSection: {
    padding: 16,
    gap: 16,
  },
  smartAlarmCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    backgroundColor: PRIMARY,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 5,
  },
  smartAlarmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smartAlarmTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: BG_DARK,
  },
  smartAlarmSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: BG_DARK,
  },
  toggleSwitch: {
    width: 56,
    height: 32,
    backgroundColor: BG_DARK,
    borderRadius: 16,
    padding: 4,
    justifyContent: 'center',
  },
  toggleKnob: {
    width: 24,
    height: 24,
    backgroundColor: PRIMARY,
    borderRadius: 12,
  },
  soundCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(15,23,42,0.5)',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  soundLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  soundIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  soundSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    paddingLeft: 4,
    color: '#f1f5f9',
  },
  tipsContainer: {
    gap: 16,
    paddingBottom: 16,
  },
  tipCard: {
    minWidth: 280,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#0f172a', // Linear gradient approximation
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  tipDesc: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 20,
  },
  tipSub: {
    fontSize: 10,
    color: 'rgba(204,255,0,0.6)',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 8,
  },
});
