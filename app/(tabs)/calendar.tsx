import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Platform, StatusBar, Dimensions } from 'react-native';
import { MaterialIcons, FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PRIMARY = "#ccff00";
const BG_DARK = "#1f230f";
const TEXT_WHITE = "#f1f5f9";
const TEXT_MUTED = "#94a3b8";
const BORDER_COLOR = "rgba(255, 255, 255, 0.05)";

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1); // Mock 30 days for June

// Mock data for calendar dots
const calendarData = {
  1: 'gray',
  2: 'primary',
  3: 'primary',
  4: 'gray',
  5: 'active', // Current day
  7: 'gray',
};

const CalendarScreen = () => {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(5);

  const getDayStyle = (day: number) => {
    if (day === selectedDay) return styles.dayCellActive;
    return styles.dayCell;
  };

  const getTextStyle = (day: number) => {
    if (day === selectedDay) return styles.dayTextActive;
    return styles.dayText;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BG_DARK} />
      
      {/* Top Navigation Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={TEXT_WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendar</Text>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="search" size={24} color={TEXT_WHITE} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Month Navigation Header */}
        <View style={styles.monthNav}>
          <Text style={styles.monthTitle}>June 2024</Text>
          <View style={styles.monthControls}>
            <TouchableOpacity style={styles.navButton}>
              <MaterialIcons name="chevron-left" size={24} color={TEXT_WHITE} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
              <MaterialIcons name="chevron-right" size={24} color={TEXT_WHITE} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Monthly Grid View */}
        <View style={styles.calendarGrid}>
          {/* Days Header */}
          <View style={styles.weekHeader}>
            {daysOfWeek.map((day, index) => (
              <Text key={index} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>
          
          {/* Days Grid */}
          <View style={styles.daysGrid}>
            {/* Empty cells for offset (starts on Saturday) */}
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.dayCell} />
            ))}
            
            {daysInMonth.map((day) => (
              <TouchableOpacity 
                key={day} 
                style={getDayStyle(day)}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={getTextStyle(day)}>{day}</Text>
                {/* Dots indicator */}
                {(calendarData as any)[day] && (calendarData as any)[day] !== 'active' && (
                  <View style={styles.dotContainer}>
                    <View style={[
                      styles.dot, 
                      { backgroundColor: (calendarData as any)[day] === 'primary' ? PRIMARY : '#64748b' }
                    ]} />
                  </View>
                )}
                {(calendarData as any)[day] === 'active' && (
                   <View style={[styles.dotContainer, { bottom: 4 }]}>
                      <View style={[styles.dot, { backgroundColor: BG_DARK }]} />
                   </View>
                )}
              </TouchableOpacity>
            ))}
            
            {/* Trailing empty cells */}
            {Array.from({ length: 6 }).map((_, i) => (
              <Text key={`trailing-${i}`} style={styles.dayTextTrailing}>{i + 16}</Text>
            ))}
          </View>
        </View>

        {/* Consistency Stats */}
        <View style={styles.statsCard}>
          <View>
            <Text style={styles.statsLabel}>Monthly Consistency</Text>
            <Text style={styles.statsValue}>85%</Text>
          </View>
          <View style={styles.statsBadge}>
            <MaterialIcons name="trending-up" size={16} color={PRIMARY} />
            <Text style={styles.statsBadgeText}>+5.2%</Text>
          </View>
        </View>

        {/* Daily Schedule Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <Text style={styles.dateLabel}>June 5, 2024</Text>
          </View>

          {/* Workout Card: Completed */}
          <View style={styles.scheduleCardCompleted}>
            <View style={styles.scheduleRow}>
              <View>
                <Text style={styles.scheduleTitle}>Upper Body Power</Text>
                <View style={styles.scheduleMeta}>
                  <MaterialIcons name="schedule" size={14} color={TEXT_MUTED} />
                  <Text style={styles.scheduleMetaText}>08:00 AM • 45 min</Text>
                </View>
              </View>
              <View style={styles.statusBadgeCompleted}>
                <MaterialIcons name="check-circle" size={12} color={BG_DARK} />
                <Text style={styles.statusTextCompleted}>COMPLETED</Text>
              </View>
            </View>
          </View>

          {/* Workout Card: Upcoming */}
          <View style={styles.scheduleCardUpcoming}>
            <View style={styles.scheduleRow}>
              <View>
                <Text style={styles.scheduleTitle}>HIIT Cardio Blast</Text>
                <View style={styles.scheduleMeta}>
                  <MaterialIcons name="schedule" size={14} color={TEXT_MUTED} />
                  <Text style={styles.scheduleMetaText}>05:30 PM • 30 min</Text>
                </View>
              </View>
              <View style={styles.statusBadgeUpcoming}>
                <Text style={styles.statusTextUpcoming}>UPCOMING</Text>
              </View>
            </View>
          </View>

          {/* Rest Day */}
          <View style={styles.restDayCard}>
            <View style={styles.restIconBox}>
              <MaterialIcons name="bedtime" size={24} color={TEXT_MUTED} />
            </View>
            <View>
              <Text style={styles.restTitle}>Active Recovery</Text>
              <Text style={styles.restSubtitle}>Light stretching and mobility</Text>
            </View>
          </View>
        </View>

        {/* Daily Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Activity</Text>
          <View style={styles.activityGrid}>
            {/* Steps */}
            <View style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <FontAwesome6 name="shoe-prints" size={16} color={PRIMARY} />
                <Text style={styles.activityLabel}>STEPS</Text>
              </View>
              <View>
                <Text style={styles.activityValue}>8,432</Text>
                <Text style={styles.activitySubtext}>/ 10,000 steps</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '84%' }]} />
              </View>
            </View>

            {/* Calories */}
            <View style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <MaterialIcons name="local-fire-department" size={20} color={PRIMARY} />
                <Text style={styles.activityLabel}>CALORIES</Text>
              </View>
              <View>
                <Text style={styles.activityValue}>450 kcal</Text>
                <Text style={styles.activitySubtext}>Active burn today</Text>
              </View>
            </View>

            {/* Hydration */}
            <View style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <MaterialIcons name="water-drop" size={20} color={PRIMARY} />
                <Text style={styles.activityLabel}>HYDRATION</Text>
              </View>
              <View>
                <Text style={styles.activityValue}>1,200 ml</Text>
                <Text style={styles.activitySubtext}>/ 2,500 ml</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '48%' }]} />
              </View>
            </View>

            {/* Sleep */}
            <View style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <MaterialIcons name="bedtime" size={20} color={PRIMARY} />
                <Text style={styles.activityLabel}>SLEEP</Text>
              </View>
              <View>
                <Text style={styles.activityValue}>7h 20m</Text>
                <Text style={styles.activitySubtext}>Last night</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Spacer */}
        <View style={{ height: 100 }} />

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
        <MaterialIcons name="add" size={32} color={BG_DARK} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_DARK,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TEXT_WHITE,
  },
  content: {
    // padding: 16, // removed padding to match full width sections
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: TEXT_WHITE,
  },
  monthControls: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarGrid: {
    padding: 16,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#94a3b8', // slate-400
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
  },
  dayCell: {
    width: '14.28%', // 100% / 7
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellActive: {
    width: '14.28%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    borderRadius: 24, // Circle
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: TEXT_WHITE,
  },
  dayTextActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: BG_DARK,
  },
  dayTextTrailing: {
    width: '14.28%',
    height: 48,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b', // slate-500
    opacity: 0.3,
  },
  dotContainer: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  statsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: TEXT_MUTED,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: TEXT_WHITE,
  },
  statsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(204, 255, 0, 0.2)',
  },
  statsBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: PRIMARY,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TEXT_WHITE,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY,
  },
  scheduleCardCompleted: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY,
    marginBottom: 16,
  },
  scheduleCardUpcoming: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    marginBottom: 16,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TEXT_WHITE,
  },
  scheduleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  scheduleMetaText: {
    fontSize: 14,
    color: TEXT_MUTED,
  },
  statusBadgeCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTextCompleted: {
    fontSize: 10,
    fontWeight: '900',
    color: BG_DARK,
    textTransform: 'uppercase',
  },
  statusBadgeUpcoming: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTextUpcoming: {
    fontSize: 10,
    fontWeight: '900',
    color: TEXT_MUTED,
    textTransform: 'uppercase',
  },
  restDayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
  },
  restIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_MUTED,
  },
  restSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.3)',
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 16,
  },
  activityCard: {
    width: (Dimensions.get('window').width - 48) / 2, // (screen width - padding - gap) / 2
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    gap: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: PRIMARY,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  activityValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TEXT_WHITE,
  },
  activitySubtext: {
    fontSize: 10,
    color: TEXT_MUTED,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: PRIMARY,
    borderRadius: 3,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
});

// Override container background for dark mode context
const darkStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG_DARK,
    }
});

export default function CalendarScreenWrapper() {
    return (
        <View style={darkStyles.container}>
            <CalendarScreen />
        </View>
    );
}