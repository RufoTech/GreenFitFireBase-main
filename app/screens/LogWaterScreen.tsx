import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar, TextInput, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const PRIMARY = "#ccff00";
const BG_DARK = "#1f230f";
const GOAL = 2500;
const { width } = Dimensions.get('window');

const initialHistory = [
  { id: 1, label: "Glass of water", time: "08:30 AM", amount: 250, icon: "water-drop", faded: false }, // Use water-drop as water_full not in MaterialIcons
  { id: 2, label: "Sports Bottle", time: "11:15 AM", amount: 500, icon: "local-drink", faded: false },
  { id: 3, label: "Large Bottle", time: "02:45 PM", amount: 450, icon: "opacity", faded: true },
];

export default function LogWaterScreen() {
  const [consumed, setConsumed] = useState(1200);
  const [customAmount, setCustomAmount] = useState("");
  const [history, setHistory] = useState(initialHistory);
  const router = useRouter();

  const percentage = Math.min(Math.round((consumed / GOAL) * 100), 100);
  // Conic gradient implementation in React Native requires a library like react-native-svg or expo-linear-gradient with tricks.
  // We'll use a simpler approach with SVG for the ring or just a View with border radius for now, similar to previous screens.
  // Actually, let's use a simple circular progress using SVG if possible, or just a text display for simplicity as requested by "bu screen acilacaq" (this screen will open)
  // I will use a simple implementation for the ring using a View with a border.

  const addWater = (amount: number, label: string, icon: string) => {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setConsumed((prev) => Math.min(prev + amount, GOAL));
    setHistory((prev) => [
      { id: Date.now(), label, time, amount, icon, faded: false },
      ...prev,
    ]);
  };

  const handleCustomAdd = () => {
    const val = parseInt(customAmount);
    if (val > 0) {
      addWater(val, `Custom amount`, "water-drop");
      setCustomAmount("");
    }
  };

  // Map icons to MaterialIcons names
  const getIconName = (icon: string) => {
      switch(icon) {
          case 'water_full': return 'water-drop'; // approximation
          case 'local_drink': return 'local-drink';
          case 'opacity': return 'opacity';
          case 'water_drop': return 'water-drop';
          default: return 'water-drop';
      }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1f230f" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#ccff00" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Log Water</Text>
          <Text style={styles.headerSubtitle}>Su İçməyi Qeyd Et</Text>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="settings" size={24} color="#ccff00" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Progress Ring Section */}
        <View style={styles.progressSection}>
            <View style={styles.ringContainer}>
                {/* Simplified Ring Visual */}
                <View style={[styles.ring, { borderColor: '#363a27' }]}>
                    <View style={styles.ringContent}>
                        <MaterialIcons name="water-drop" size={48} color="#ccff00" style={{ marginBottom: 8 }} />
                        <Text style={styles.consumedText}>
                            {(consumed / 1000).toFixed(1)}
                            <Text style={styles.goalText}>/2.5L</Text>
                        </Text>
                        <Text style={styles.percentageText}>{percentage}% Completed</Text>
                    </View>
                </View>
                {/* Active Ring Overlay - simplified as a partial border is hard without SVG */}
                {/* For now we stick to the provided UI look which uses a conic gradient. 
                    In RN, we can't easily do conic gradients without a library. 
                    I'll add a visual indicator below instead or use a library if available. 
                    Since I cannot install new libraries, I will rely on the text and static styling.
                */}
            </View>

            <View style={styles.dailyGoalContainer}>
                <Text style={styles.dailyGoalTitle}>Daily Goal / Gündəlik Hədəf</Text>
                <Text style={styles.dailyGoalSubtitle}>Stay hydrated for better performance</Text>
            </View>
        </View>

        {/* Quick Add Section */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Add Water / Su Əlavə Et</Text>
                <View style={styles.quickLogBadge}>
                    <Text style={styles.quickLogText}>QUICK LOG</Text>
                </View>
            </View>

            <View style={styles.quickButtonsGrid}>
                {[
                    { amount: 250, icon: "water-drop", label: "Glass of water" }, // water_full -> water-drop
                    { amount: 500, icon: "local-drink", label: "Sports Bottle" },
                    { amount: 750, icon: "opacity", label: "Large Bottle" },
                ].map(({ amount, icon, label }) => (
                    <TouchableOpacity 
                        key={amount} 
                        style={styles.quickButton}
                        onPress={() => addWater(amount, label, icon)}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name={icon as any} size={24} color="#ccff00" style={{ marginBottom: 4 }} />
                        <Text style={styles.quickButtonText}>+{amount}ml</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Custom Input */}
            <View style={styles.customInputContainer}>
                <MaterialIcons name="edit" size={20} color={customAmount ? "#ccff00" : "#64748b"} style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    value={customAmount}
                    onChangeText={setCustomAmount}
                    placeholder="Custom amount (ml) / Fərqli miqdar"
                    placeholderTextColor="#64748b"
                    keyboardType="numeric"
                    onSubmitEditing={handleCustomAdd}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleCustomAdd}>
                    <Text style={styles.addButtonText}>ADD</Text>
                </TouchableOpacity>
            </View>
        </View>

        {/* History Section */}
        <View style={[styles.section, { paddingBottom: 32 }]}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today's History / Bu gün</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.historyList}>
                {history.map((item) => (
                    <View key={item.id} style={[styles.historyItem, { opacity: item.faded ? 0.6 : 1 }]}>
                        <View style={styles.historyLeft}>
                            <View style={styles.historyIconContainer}>
                                <MaterialIcons name={getIconName(item.icon) as any} size={20} color="#ccff00" />
                            </View>
                            <View>
                                <Text style={styles.historyLabel}>{item.label}</Text>
                                <Text style={styles.historyTime}>{item.time}</Text>
                            </View>
                        </View>
                        <Text style={styles.historyAmount}>+{item.amount}ml</Text>
                    </View>
                ))}
            </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCtaContainer}>
          <TouchableOpacity style={styles.reminderButton} activeOpacity={0.8}>
              <MaterialIcons name="notifications-active" size={24} color="#1f230f" />
              <Text style={styles.reminderButtonText}>SET HYDRATION REMINDER</Text>
          </TouchableOpacity>
      </View>

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
    paddingVertical: 16,
    backgroundColor: 'rgba(31, 35, 15, 0.8)',
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
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
    lineHeight: 22,
  },
  headerSubtitle: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: 'rgba(204, 255, 0, 0.7)',
    marginTop: 2,
  },
  scrollContent: {
    paddingTop: 80, // Space for header
    paddingBottom: 100, // Space for bottom CTA
  },
  progressSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  ringContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    width: 256,
    height: 256,
    borderRadius: 128,
    borderWidth: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f230f',
    shadowColor: '#ccff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  ringContent: {
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: '#1f230f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  consumedText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#f1f5f9',
    letterSpacing: -0.5,
  },
  goalText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#94a3b8',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ccff00',
    marginTop: 4,
  },
  dailyGoalContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  dailyGoalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  dailyGoalSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 32,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  quickLogBadge: {
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  quickLogText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ccff00',
  },
  quickButtonsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(204, 255, 0, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.2)',
  },
  quickButtonText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#f1f5f9',
  },
  customInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    flex: 1,
    paddingLeft: 48,
    paddingRight: 96,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(204, 255, 0, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.1)',
    color: '#f1f5f9',
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    right: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ccff00',
    borderRadius: 8,
  },
  addButtonText: {
    color: '#1f230f',
    fontWeight: '700',
    fontSize: 13,
  },
  viewAllText: {
    color: '#ccff00',
    fontSize: 14,
    fontWeight: '600',
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(30, 41, 59, 0.8)',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(204, 255, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyLabel: {
    fontWeight: '700',
    fontSize: 14,
    color: '#f1f5f9',
  },
  historyTime: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  historyAmount: {
    fontWeight: '700',
    color: '#ccff00',
    fontSize: 14,
  },
  bottomCtaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(31, 35, 15, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(30, 41, 59, 0.6)',
  },
  reminderButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#ccff00',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#ccff00',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  reminderButtonText: {
    color: '#1f230f',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
