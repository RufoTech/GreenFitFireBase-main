import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Platform, StatusBar, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const PRIMARY = "#ccff00";
const BG_DARK = "#1f230f";
const { width } = Dimensions.get('window');

const calendarData = {
  leadingEmpty: 6,
  days: [
    { day: 1, level: "border-low" },
    { day: 2, level: "border-mid" },
    { day: 3, level: "fill-low" },
    { day: 4, level: "full-glow" },
    { day: 5, level: "fill-high" },
    { day: 6, level: "border-full" },
    { day: 7, level: "fill-xlow" },
    { day: 8, level: "full" },
    { day: 9, level: "full" },
    { day: 10, level: "border-mid" },
    { day: 11, level: "full" },
    { day: 12, level: "border-full" },
    { day: 13, level: "fill-mid" },
    { day: 14, level: "border-xlow" },
    { day: 15, level: "fill-xhigh" },
    { day: 16, level: "full" },
    ...Array.from({ length: 15 }, (_, i) => ({ day: i + 17, level: "empty" })),
  ],
};

const recentDays = [
  { date: "Oct 26 | 26 Oktyabr", steps: 8100, goal: 10000 },
  { date: "Oct 25 | 25 Oktyabr", steps: 5200, goal: 10000 },
  { date: "Oct 24 | 24 Oktyabr", steps: 11200, goal: 10000 },
];

const levelStyles: any = {
  "border-low": { borderWidth: 2, borderColor: `${PRIMARY}33` },
  "border-mid": { borderWidth: 2, borderColor: `${PRIMARY}66` },
  "fill-low": { backgroundColor: `${PRIMARY}33` },
  "full-glow": { 
    backgroundColor: PRIMARY, 
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10
  },
  "fill-high": { backgroundColor: `${PRIMARY}99` },
  "border-full": { borderWidth: 2, borderColor: PRIMARY },
  "fill-xlow": { backgroundColor: `${PRIMARY}1a` },
  full: { backgroundColor: PRIMARY },
  "border-xlow": { borderWidth: 2, borderColor: `${PRIMARY}1a` },
  "fill-mid": { backgroundColor: `${PRIMARY}66` },
  "fill-xhigh": { backgroundColor: `${PRIMARY}cc` },
  empty: { backgroundColor: "#1e293b" },
};

const getLevelTextColor = (level: string) => {
    if (level === 'full' || level === 'full-glow' || level.includes('fill-high') || level.includes('fill-mid')) {
        return '#0f172a';
    }
    if (level === 'border-full') return PRIMARY;
    if (level === 'empty') return '#475569';
    return '#94a3b8';
}

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
const stepsCount = 6450;
const goalCount = 10000;
const pct = Math.round((stepsCount / goalCount) * 100);
const R = 110;
const circ = 2 * Math.PI * R;
const offset = circ - (pct / 100) * circ;

export default function AddStepsScreen() {
  const [calOpen, setCalOpen] = useState(true);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1f230f" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#f1f5f9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Steps </Text>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="settings" size={24} color="#f1f5f9" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Circular Progress */}
        <View style={styles.progressSection}>
            <View style={styles.circleContainer}>
                <Svg width={256} height={256} viewBox="0 0 256 256" style={{ transform: [{ rotate: '-90deg' }] }}>
                    <Circle
                        cx="128"
                        cy="128"
                        r={R}
                        fill="transparent"
                        stroke="#1e293b"
                        strokeWidth="12"
                    />
                    <Circle
                        cx="128"
                        cy="128"
                        r={R}
                        fill="transparent"
                        stroke={PRIMARY}
                        strokeWidth="12"
                        strokeDasharray={circ}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                    />
                </Svg>
                <View style={styles.progressTextContainer}>
                    <Text style={styles.stepsText}>{stepsCount.toLocaleString()}</Text>
                    <Text style={styles.goalText}>/ {goalCount.toLocaleString()}</Text>
                </View>
            </View>
            <View style={styles.motivationContainer}>
                <Text style={styles.motivationTitle}>Keep moving!</Text>
            </View>
        </View>

        {/* Goal Progress Bar */}
        <View style={styles.section}>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardLabel}>Daily Goal</Text>
                    <Text style={styles.percentageText}>{pct}%</Text>
                </View>
                <View style={styles.barBackground}>
                    <View style={[styles.barFill, { width: `${pct}%` }]} />
                </View>
            </View>
        </View>

        {/* Calendar */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>Monthly Activity</Text>
                    <TouchableOpacity 
                        style={styles.expandButton}
                        onPress={() => setCalOpen(!calOpen)}
                    >
                        <MaterialIcons 
                            name={calOpen ? "expand-less" : "expand-more"} 
                            size={24} 
                            color="#f1f5f9" 
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.monthText}>October | Oktyabr</Text>
            </View>

            {calOpen && (
                <View style={styles.calendarCard}>
                    <View style={styles.weekDaysGrid}>
                        {weekDays.map((d, i) => (
                            <Text key={i} style={styles.weekDayText}>{d}</Text>
                        ))}
                    </View>
                    <View style={styles.daysGrid}>
                        {Array.from({ length: calendarData.leadingEmpty }, (_, i) => (
                            <View key={`e-${i}`} style={styles.dayCell} />
                        ))}
                        {calendarData.days.map(({ day, level }: any) => (
                            <View 
                                key={day} 
                                style={[styles.dayCell, styles.dayCircle, levelStyles[level]]}
                            >
                                <Text style={[styles.dayText, { color: getLevelTextColor(level) }]}>{day}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={styles.legendContainer}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: PRIMARY }]} />
                            <Text style={styles.legendText}>Goal Met</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { borderWidth: 1, borderColor: PRIMARY }]} />
                            <Text style={styles.legendText}>Partial</Text>
                        </View>
                    </View>
                </View>
            )}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Last 7 Days | Son 7 gün</Text>
            <View style={styles.recentList}>
                {recentDays.map(({ date, steps: s, goal: g }, index) => {
                    const p = Math.min((s / g) * 100, 100);
                    const met = s >= g;
                    return (
                        <View key={index} style={styles.recentCard}>
                            <View style={styles.recentHeader}>
                                <Text style={styles.recentDate}>{date}</Text>
                                <Text style={[styles.recentSteps, { color: met ? PRIMARY : "#94a3b8" }]}>
                                    {s.toLocaleString()} steps
                                </Text>
                            </View>
                            <View style={styles.barBackground}>
                                <View 
                                    style={[
                                        styles.barFill, 
                                        { width: `${p}%`, backgroundColor: met ? PRIMARY : `${PRIMARY}66` }
                                    ]} 
                                />
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>

        <View style={{ height: 24 }} />
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
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b', // slate-800
    backgroundColor: BG_DARK,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1f5f9',
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  progressSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  circleContainer: {
    width: 256,
    height: 256,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsText: {
    fontSize: 40, // 4xl equivalent approx
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
  },
  goalText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#94a3b8', // slate-400
    marginTop: 4,
  },
  motivationContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  motivationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  motivationSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: PRIMARY,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)', // slate-800/40
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1e293b', // slate-800
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  percentageText: {
    fontSize: 24,
    fontWeight: '900',
    color: PRIMARY,
  },
  barBackground: {
    height: 12,
    backgroundColor: '#334155', // slate-700
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: PRIMARY,
    borderRadius: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  expandButton: {
    padding: 4,
    borderRadius: 12,
  },
  monthText: {
    fontSize: 14,
    fontWeight: '500',
    color: PRIMARY,
  },
  calendarCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.3)', // slate-800/30
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
  },
  weekDaysGrid: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  weekDayText: {
    width: (width - 64) / 7, // approximate width calculation
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b', // slate-500
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-between',
  },
  dayCell: {
    width: (width - 70) / 7, // width minus padding / 7
    aspectRatio: 1,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    borderRadius: 999,
  },
  dayText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  recentList: {
    gap: 16,
  },
  recentCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1', // slate-300
  },
  recentSteps: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
