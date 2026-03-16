import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Platform, StatusBar, Dimensions } from 'react-native';
import { MaterialIcons, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';

const PRIMARY = "#ccff00";
const BG_DARK = "#12140a";
const CARD_BG = "#1a1d0f";
const TEXT_WHITE = "rgba(255, 255, 255, 0.9)";
const TEXT_MUTED = "rgba(255, 255, 255, 0.4)";
const BORDER_COLOR = "rgba(255, 255, 255, 0.05)";

const { width } = Dimensions.get('window');

const LogWeightScreen = () => {
  const router = useRouter();
  const [weight, setWeight] = useState(80.5);
  const [unit, setUnit] = useState("kg");
  const [bodyFat, setBodyFat] = useState("18.5");
  const [addVal, setAddVal] = useState("");
  const [subVal, setSubVal] = useState("");
  const [notes, setNotes] = useState("");
  const [measurements, setMeasurements] = useState({
    neck: "",
    chest: "",
    waist: "",
    arms: "",
    legs: "",
  });

  const handleMeasurementChange = (key: string, value: string) => {
    setMeasurements((prev) => ({ ...prev, [key]: value }));
  };

  const adjustWeight = (amount: number) => {
    setWeight((prev) => parseFloat((prev + amount).toFixed(1)));
  };

  const handleAddWeight = () => {
    if (addVal) {
      adjustWeight(parseFloat(addVal));
      setAddVal("");
    }
  };

  const handleSubWeight = () => {
    if (subVal) {
      adjustWeight(-parseFloat(subVal));
      setSubVal("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BG_DARK} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <FontAwesome6 name="chevron-left" size={18} color={TEXT_MUTED} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Log Weight & Body Stats</Text>
        </View>
        <View style={styles.headerRight}>
            <FontAwesome6 name="cloud-arrow-up" size={14} color={PRIMARY} style={styles.headerIcon} />
            <TouchableOpacity style={styles.backButton}>
                <FontAwesome6 name="rotate-right" size={18} color={TEXT_MUTED} />
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Goal Tracker */}
        <View style={styles.card}>
            <View style={styles.goalHeader}>
                <View>
                    <Text style={styles.labelSmall}>GOAL PROGRESS</Text>
                    <Text style={styles.goalTarget}>Target: <Text style={{ color: PRIMARY }}>75.0kg</Text></Text>
                </View>
                <Text style={styles.goalRemaining}>Remaining: <Text style={{ color: 'white' }}>5.5kg</Text></Text>
            </View>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '72%' }]} />
            </View>
        </View>

        {/* Weight Input */}
        <View style={styles.card}>
            <View style={styles.weightHeader}>
                <Text style={styles.cardTitle}>Current Weight</Text>
                <View style={styles.unitToggle}>
                    <TouchableOpacity 
                        onPress={() => setUnit("kg")}
                        style={[styles.unitButton, unit === "kg" && styles.unitButtonActive]}
                    >
                        <Text style={[styles.unitText, unit === "kg" && styles.unitTextActive]}>kg</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setUnit("lb")}
                        style={[styles.unitButton, unit === "lb" && styles.unitButtonActive]}
                    >
                        <Text style={[styles.unitText, unit === "lb" && styles.unitTextActive]}>lb</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.weightDisplay}>
                <TextInput 
                    style={styles.weightInput}
                    value={weight.toString()}
                    onChangeText={(t) => setWeight(parseFloat(t) || 0)}
                    keyboardType="numeric"
                    placeholderTextColor={TEXT_MUTED}
                />
                <Text style={styles.lastEntry}>
                    Last entry: <Text style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>81.2 kg</Text> (3 days ago)
                </Text>
            </View>

            <View style={styles.quickAddGrid}>
                {[0.5, 1.0, 2.5].map((v) => (
                    <TouchableOpacity 
                        key={v} 
                        onPress={() => adjustWeight(v)}
                        style={styles.quickAddButton}
                    >
                        <Text style={styles.quickAddText}>+ {v.toFixed(1)}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.manualAdjustGrid}>
                <View style={styles.adjustInputContainer}>
                    <TextInput 
                        style={styles.adjustInput}
                        placeholder="Val"
                        placeholderTextColor="rgba(255,255,255,0.2)"
                        keyboardType="numeric"
                        value={addVal}
                        onChangeText={setAddVal}
                    />
                    <TouchableOpacity onPress={handleAddWeight} style={styles.adjustButtonAdd}>
                        <Text style={styles.adjustButtonTextDark}>ADD</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.adjustInputContainer}>
                    <TextInput 
                        style={styles.adjustInput}
                        placeholder="Val"
                        placeholderTextColor="rgba(255,255,255,0.2)"
                        keyboardType="numeric"
                        value={subVal}
                        onChangeText={setSubVal}
                    />
                    <TouchableOpacity onPress={handleSubWeight} style={styles.adjustButtonSub}>
                        <Text style={styles.adjustButtonTextLight}>SUB</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

        {/* Body Stats Grid */}
        <View style={styles.statsGrid}>
            <View style={[styles.card, { flex: 1 }]}>
                <View style={styles.cardHeaderRow}>
                    <Text style={styles.labelSmall}>BODY FAT %</Text>
                    <FontAwesome6 name="circle-info" size={10} color="rgba(255,255,255,0.2)" />
                </View>
                <View style={styles.statValueRow}>
                    <TextInput 
                        style={styles.statInput}
                        value={bodyFat}
                        onChangeText={setBodyFat}
                        keyboardType="numeric"
                    />
                    <Text style={styles.statUnit}>%</Text>
                </View>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>NORMAL</Text>
                </View>
                <TouchableOpacity 
                    style={styles.calculateButton}
                    onPress={() => router.push('/screens/BodyFatCalculatorScreen')}
                >
                    <Text style={styles.calculateButtonText}>CALCULATE</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.card, { flex: 1 }]}>
                <Text style={[styles.labelSmall, { marginBottom: 12 }]}>BMI</Text>
                <View style={styles.statValueRow}>
                    <Text style={styles.statValueFixed}>24.2</Text>
                    <Text style={styles.bmiStatus}>HEALTHY</Text>
                </View>
                
                {/* BMI Bar */}
                <View style={styles.bmiBarContainer}>
                    <View style={[styles.bmiBarSegment, { backgroundColor: 'rgba(59, 130, 246, 0.5)' }]} />
                    <View style={[styles.bmiBarSegment, { backgroundColor: PRIMARY }]}>
                        <View style={styles.bmiIndicator} />
                    </View>
                    <View style={[styles.bmiBarSegment, { backgroundColor: 'rgba(234, 179, 8, 0.5)' }]} />
                    <View style={[styles.bmiBarSegment, { backgroundColor: 'rgba(239, 68, 68, 0.5)' }]} />
                </View>
                
                <Text style={styles.bmiDescription}>Your BMI is in the healthy range.</Text>
            </View>
        </View>

        {/* Body Measurements */}
        <View style={styles.card}>
            <Text style={[styles.cardTitle, { marginBottom: 16 }]}>Body Measurements (cm)</Text>
            <View>
                {[
                    { key: "neck", label: "Neck", icon: "arrow-up-from-bracket" }, // approximation for person-arrow-up-from-line
                    { key: "chest", label: "Chest", icon: "arrows-left-right" },
                    { key: "waist", label: "Waist", icon: "ring" },
                    { key: "arms", label: "Arms", icon: "hand-fist" },
                    { key: "legs", label: "Legs", icon: "socks" },
                ].map(({ key, label, icon }, i, arr) => (
                    <View 
                        key={key} 
                        style={[
                            styles.measurementRow, 
                            i < arr.length - 1 && styles.measurementBorder
                        ]}
                    >
                        <View style={styles.measurementLabelContainer}>
                            <View style={styles.measurementIconBox}>
                                <FontAwesome6 name={icon as any} size={14} color={PRIMARY} />
                            </View>
                            <Text style={styles.measurementLabel}>{label}</Text>
                        </View>
                        <TextInput 
                            style={styles.measurementInput}
                            placeholder="--"
                            placeholderTextColor={TEXT_MUTED}
                            keyboardType="numeric"
                            value={(measurements as any)[key]}
                            onChangeText={(t) => handleMeasurementChange(key, t)}
                        />
                    </View>
                ))}
            </View>
        </View>

        {/* Weight Trend Chart */}
        <View style={styles.card}>
            <View style={[styles.cardHeaderRow, { marginBottom: 16 }]}>
                <View>
                    <Text style={styles.cardTitle}>Weight Trend</Text>
                    <Text style={styles.subTitle}>Last 7 days</Text>
                </View>
                <View style={styles.trendValueContainer}>
                    <FontAwesome6 name="arrow-trend-down" size={12} color={PRIMARY} />
                    <Text style={styles.trendValue}>0.8kg</Text>
                </View>
            </View>
            <View style={styles.chartContainer}>
                <Svg height="100%" width="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <Defs>
                        <LinearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={PRIMARY} stopOpacity="0.3" />
                            <Stop offset="1" stopColor={PRIMARY} stopOpacity="0" />
                        </LinearGradient>
                    </Defs>
                    <Path 
                        d="M0,25 Q15,22 25,24 T45,18 T65,20 T85,10 T100,5"
                        fill="none"
                        stroke={PRIMARY}
                        strokeWidth="1.5"
                    />
                    <Path 
                        d="M0,25 Q15,22 25,24 T45,18 T65,20 T85,10 T100,5 L100,30 L0,30 Z"
                        fill="url(#neonGradient)"
                    />
                    <Circle cx="100" cy="5" r="1.5" fill={PRIMARY} />
                    <Circle cx="85" cy="10" r="1" fill={PRIMARY} stroke={CARD_BG} strokeWidth="0.2" />
                    <Circle cx="65" cy="20" r="1" fill={PRIMARY} stroke={CARD_BG} strokeWidth="0.2" />
                </Svg>
            </View>
        </View>

        {/* Daily Notes */}
        <View style={styles.card}>
            <View style={[styles.cardHeaderRow, { justifyContent: 'flex-start', gap: 8, marginBottom: 12 }]}>
                <FontAwesome6 name="comment-dots" size={16} color={TEXT_MUTED} />
                <Text style={styles.cardTitle}>Daily Notes</Text>
            </View>
            <TextInput 
                style={styles.notesInput}
                placeholder="How are you feeling today? Any specific meals or workouts?"
                placeholderTextColor="rgba(255,255,255,0.2)"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={notes}
                onChangeText={setNotes}
            />
        </View>

        {/* Save Button */}
        <View style={styles.footer}>
            <TouchableOpacity style={styles.saveButton} activeOpacity={0.9} onPress={() => router.back()}>
                <Text style={styles.saveButtonText}>Save Entry</Text>
            </TouchableOpacity>
            <Text style={styles.footerNote}>Your data is securely synced with your profile.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

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
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'rgba(18, 20, 10, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: -0.5,
  },
  headerIcon: {
    marginRight: -4,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 24,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#252a16',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT_MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  goalTarget: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  goalRemaining: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
  },
  progressBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: PRIMARY,
    borderRadius: 6,
  },
  weightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  subTitle: {
    fontSize: 12,
    color: TEXT_MUTED,
    fontWeight: '500',
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  unitButton: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 8,
  },
  unitButtonActive: {
    backgroundColor: PRIMARY,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  unitText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: TEXT_MUTED,
  },
  unitTextActive: {
    color: BG_DARK,
  },
  weightDisplay: {
    alignItems: 'center',
    marginBottom: 32,
  },
  weightInput: {
    fontSize: 64,
    fontWeight: '900',
    color: PRIMARY,
    textAlign: 'center',
    width: '100%',
    padding: 0,
  },
  lastEntry: {
    marginTop: 8,
    fontSize: 14,
    color: TEXT_MUTED,
  },
  quickAddGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  quickAddButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    alignItems: 'center',
  },
  quickAddText: {
    color: PRIMARY,
    fontWeight: 'bold',
    fontSize: 14,
  },
  manualAdjustGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  adjustInputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  adjustInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    paddingHorizontal: 8,
  },
  adjustButtonAdd: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  adjustButtonSub: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  adjustButtonTextDark: {
    color: BG_DARK,
    fontSize: 12,
    fontWeight: 'bold',
  },
  adjustButtonTextLight: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 8,
  },
  statInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    padding: 0,
    minWidth: 60,
  },
  statValueFixed: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statUnit: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TEXT_MUTED,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: PRIMARY,
    textTransform: 'uppercase',
  },
  bmiStatus: {
    fontSize: 10,
    fontWeight: 'bold',
    color: PRIMARY,
    textTransform: 'uppercase',
  },
  calculateButton: {
    marginTop: 'auto',
    backgroundColor: PRIMARY,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  calculateButtonText: {
    fontSize: 10,
    fontWeight: '900',
    color: BG_DARK,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  bmiBarContainer: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    gap: 2,
    marginTop: 12,
    marginBottom: 8,
  },
  bmiBarSegment: {
    flex: 1,
    position: 'relative',
  },
  bmiIndicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 4,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  bmiDescription: {
    fontSize: 10,
    color: TEXT_MUTED,
    lineHeight: 14,
  },
  measurementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  measurementBorder: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  measurementLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  measurementIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  measurementLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
  },
  measurementInput: {
    width: 80,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    padding: 0,
  },
  trendValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PRIMARY,
  },
  chartContainer: {
    height: 96,
    width: '100%',
    marginTop: 16,
  },
  notesInput: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  saveButton: {
    width: '100%',
    backgroundColor: PRIMARY,
    paddingVertical: 20,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BG_DARK,
  },
  footerNote: {
    marginTop: 16,
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
  },
});

export default LogWeightScreen;