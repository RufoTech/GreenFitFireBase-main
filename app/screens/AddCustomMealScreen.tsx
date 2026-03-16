import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const PRIMARY = "#CCFF00";
const BG_DARK = "#0F0F0F";
const TEXT_COLOR = "#FFFFFF";

const categories = ["Breakfast", "Lunch", "Dinner", "Snack"];

const AddCustomMealScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Lunch");
  const [saved, setSaved] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    mealName: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    fiber: "",
    sugar: "",
    sodium: "",
    cholesterol: "",
    potassium: "",
    servingSize: "",
    unit: "",
  });
  const [warning, setWarning] = useState<string | null>(null);

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setImagePreview(result.assets[0].uri);
    }
  };

  const handleServingChange = (text: string) => {
    if (form.unit) {
      setWarning("Please clear Unit before entering Serving Size");
      setTimeout(() => setWarning(null), 3000);
      return;
    }
    setForm(f => ({ ...f, servingSize: text }));
  };

  const handleUnitChange = (text: string) => {
    if (form.servingSize) {
      setWarning("Please clear Serving Size before entering Unit");
      setTimeout(() => setWarning(null), 3000);
      return;
    }
    setForm(f => ({ ...f, unit: text }));
  };

  const handleField = (field: string) => (text: string) => {
    setForm((f) => ({ ...f, [field]: text }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
        setSaved(false);
        router.back();
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BG_DARK} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
           <MaterialIcons name="arrow-back" size={24} color={TEXT_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Custom Meal</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Image Upload Section */}
        <View style={styles.section} data-purpose="image-upload">
            <Text style={styles.sectionLabel}>MEAL PHOTO</Text>
            <TouchableOpacity 
                onPress={pickImage} 
                style={styles.imageUploadContainer}
                activeOpacity={0.8}
            >
                {imagePreview ? (
                    <Image source={{ uri: imagePreview }} style={styles.previewImage} />
                ) : (
                    <View style={styles.placeholderContainer}>
                        <MaterialIcons name="add-a-photo" size={32} color="#6b7280" />
                        <Text style={styles.placeholderText}>Add Photo</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>

        {/* Meal Name Section */}
        <View style={styles.section} data-purpose="basic-info">
            <Text style={styles.sectionLabel}>MEAL NAME</Text>
            <TextInput 
                style={styles.input}
                placeholder="e.g. Homemade Quinoa Bowl"
                placeholderTextColor="#525252"
                value={form.mealName}
                onChangeText={handleField("mealName")}
            />
        </View>

        {/* Nutritional Information Section */}
        <View style={styles.section} data-purpose="nutritional-info">
            <View style={styles.nutritionHeader}>
                <Text style={styles.sectionLabel}>NUTRITIONAL INFORMATION</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>PER SERVING</Text>
                </View>
            </View>
            
            <View style={styles.grid}>
                <NutritionInput 
                    label="Calories (kcal)" 
                    value={form.calories} 
                    onChangeText={handleField("calories")} 
                    color={TEXT_COLOR} 
                />
                <NutritionInput 
                    label="Protein (g)" 
                    value={form.protein} 
                    onChangeText={handleField("protein")} 
                    color={PRIMARY} 
                />
                <NutritionInput 
                    label="Carbohydrates (g)" 
                    value={form.carbs} 
                    onChangeText={handleField("carbs")} 
                    color={TEXT_COLOR} 
                />
                <NutritionInput 
                    label="Fats (g)" 
                    value={form.fats} 
                    onChangeText={handleField("fats")} 
                    color={TEXT_COLOR} 
                />
                <NutritionInput 
                    label="Fiber (g)" 
                    value={form.fiber} 
                    onChangeText={handleField("fiber")} 
                    color={TEXT_COLOR} 
                />
                <NutritionInput 
                    label="Sugar (g)" 
                    value={form.sugar} 
                    onChangeText={handleField("sugar")} 
                    color={TEXT_COLOR} 
                />
                <NutritionInput 
                    label="Sodium (mg)" 
                    value={form.sodium} 
                    onChangeText={handleField("sodium")} 
                    color={TEXT_COLOR} 
                />
                <NutritionInput 
                    label="Cholesterol (mg)" 
                    value={form.cholesterol} 
                    onChangeText={handleField("cholesterol")} 
                    color={TEXT_COLOR} 
                />
                <NutritionInput 
                    label="Potassium (mg)" 
                    value={form.potassium} 
                    onChangeText={handleField("potassium")} 
                    color={TEXT_COLOR} 
                />
            </View>
        </View>

        {/* Serving Size / Unit Section */}
        <View style={styles.section} data-purpose="serving-size">
            <View style={styles.servingHeaderRow}>
                <Text style={[styles.sectionLabel, { flex: 1 }]}>SERVING SIZE</Text>
                <Text style={[styles.sectionLabel, { flex: 1 }]}>UNIT (COUNT)</Text>
            </View>
            
            <View style={styles.servingRow}>
                <TextInput 
                    style={[
                        styles.input, 
                        styles.halfInput,
                        form.unit ? styles.inputDisabled : null
                    ]}
                    placeholder="e.g. 100g"
                    placeholderTextColor="#525252"
                    value={form.servingSize}
                    onChangeText={handleServingChange}
                />
                
                <View style={styles.orDivider}>
                    <Text style={styles.orText}>OR</Text>
                </View>

                <TextInput 
                    style={[
                        styles.input, 
                        styles.halfInput,
                        form.servingSize ? styles.inputDisabled : null
                    ]}
                    placeholder="e.g. 1 slice"
                    placeholderTextColor="#525252"
                    value={form.unit}
                    onChangeText={handleUnitChange}
                />
            </View>

            {warning && (
                <View style={styles.warningContainer}>
                    <MaterialIcons name="info-outline" size={20} color="#FF4500" />
                    <Text style={styles.warningText}>{warning}</Text>
                </View>
            )}
        </View>

        {/* Category Selector Section */}
        <View style={styles.section} data-purpose="category-selection">
            <Text style={styles.sectionLabel}>CATEGORY</Text>
            <View style={styles.categoryGrid}>
                {categories.map((cat) => {
                    const active = selectedCategory === cat;
                    return (
                        <TouchableOpacity
                            key={cat}
                            onPress={() => setSelectedCategory(cat)}
                            style={[
                                styles.categoryButton,
                                active ? styles.categoryButtonActive : styles.categoryButtonInactive
                            ]}
                        >
                            <Text style={[
                                styles.categoryText,
                                active ? styles.categoryTextActive : styles.categoryTextInactive
                            ]}>{cat}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>

      </ScrollView>

      {/* Action Button Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
            onPress={handleSave}
            disabled={saved}
            style={[styles.saveButton, saved && styles.saveButtonDisabled]}
            activeOpacity={0.9}
        >
            <Text style={styles.saveButtonText}>{saved ? "Meal Saved!" : "Save Meal"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const NutritionInput = ({ label, value, onChangeText, color }: { label: string, value: string, onChangeText: (text: string) => void, color: string }) => (
    <View style={styles.nutritionItem}>
        <Text style={styles.nutritionLabel}>{label}</Text>
        <TextInput 
            style={[styles.nutritionValue, { color }]}
            value={value}
            onChangeText={onChangeText}
            placeholder="0"
            placeholderTextColor="#525252"
            keyboardType="numeric"
        />
    </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_DARK,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'rgba(15, 15, 15, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TEXT_COLOR,
    marginLeft: 16,
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af', // gray-400
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  imageUploadContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#1A1A1A',
    borderWidth: 2,
    borderColor: '#333333',
    borderStyle: 'dashed', 
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  input: {
    width: '100%',
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: TEXT_COLOR,
  },
  nutritionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: PRIMARY,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  nutritionItem: {
    width: '47%', 
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  nutritionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 0,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(204, 255, 0, 0.05)',
    borderColor: PRIMARY,
  },
  categoryButtonInactive: {
    backgroundColor: '#1A1A1A',
    borderColor: '#333333',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: PRIMARY,
    fontWeight: 'bold',
  },
  categoryTextInactive: {
    color: TEXT_COLOR, 
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: BG_DARK,
  },
  saveButton: {
    width: '100%',
    backgroundColor: PRIMARY,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  saveButtonDisabled: {
    opacity: 0.8,
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '800',
  },
  servingHeaderRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  servingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  halfInput: {
    flex: 1,
    width: undefined,
  },
  inputDisabled: {
    opacity: 0.5,
    backgroundColor: '#1A1A1A',
  },
  orDivider: {
    paddingHorizontal: 4,
  },
  orText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '700',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 69, 0, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 0, 0.3)',
  },
  warningText: {
    color: '#FF4500',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
});

export default AddCustomMealScreen;