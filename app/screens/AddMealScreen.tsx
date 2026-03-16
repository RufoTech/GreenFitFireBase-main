import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar, TextInput, ScrollView, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import firestore from '@react-native-firebase/firestore';

const PRIMARY = "#ccff00";
const BG_DARK = "#1f230f";

interface MealItemProps {
    icon?: string;
    imageUrl?: string;
    name: string;
    detail: string;
    onAdd?: (item: any) => void;
    data: any; // Full food data
}

const MealItem = ({ icon, imageUrl, name, detail, onAdd, data }: MealItemProps) => {
  const [added, setAdded] = useState(false);

  const router = useRouter();

  const handleMealPress = (item: any) => {
    router.push({
      pathname: "/screens/MealDetailsScreen",
      params: { 
        name: item.name, 
        detail: item.detail, 
        icon: item.icon, 
        imageUrl: item.imageUrl,
        // Pass nutritional data
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        servingSize: data.servingSize,
        potassium: data.potassium,
        sodium: data.sodium,
        sugar: data.sugar,
        fiber: data.fiber,
        cholesterol: data.cholesterol,
        detailsImage: data.detailsImage
      }
    });
  };

  const handleAdd = () => {
    setAdded(true);
    onAdd?.({ name, detail, icon, imageUrl, ...data });
    // Visual feedback duration
    setTimeout(() => setAdded(false), 1000);
  };


  return (
    <TouchableOpacity 
        style={styles.mealItem}
        onPress={() => handleMealPress({ name, detail, icon, imageUrl })}
        activeOpacity={0.7}
    >
      <View style={styles.mealLeft}>
        <View style={styles.mealIconContainer}>
          {imageUrl ? (
             <Image source={{ uri: imageUrl }} style={styles.mealImage} resizeMode="cover" />
          ) : (
             <MaterialIcons name={icon as any || "restaurant"} size={24} color={PRIMARY} />
          )}
        </View>
        <View>
          <Text style={styles.mealName}>{name}</Text>
          <Text style={styles.mealDetail}>{detail}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleAdd}
        style={[
            styles.addButton,
            added ? styles.addButtonAdded : styles.addButtonNormal
        ]}
        activeOpacity={0.8}
      >
        <MaterialIcons name={added ? "check" : "add"} size={24} color="#1f230f" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default function AddMealScreen() {
  const [activeCategory, setActiveCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addedItems, setAddedItems] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const snapshot = await firestore().collection('foods').get();
        const foodList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(foodList.map((item: any) => item.category).filter(Boolean))) as string[];
        
        setCategories(uniqueCategories);
        setFoods(foodList);
        
        if (uniqueCategories.length > 0) {
            setActiveCategory(uniqueCategories[0]);
        }
      } catch (error) {
        console.error("Error fetching foods:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFoods();
  }, []);

  const getFilteredFoods = () => {
    let filtered = foods;
    
    // Filter by category
    if (activeCategory) {
        filtered = filtered.filter(f => f.category === activeCategory);
    }
    
    // Filter by search
    if (search) {
        filtered = filtered.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
    }
    
    return filtered;
  };

  const handleAdd = (item: any) => {
    setAddedItems((prev) => [...prev, item]);
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(31,35,15,0.8)" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
            <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => router.back()}
            >
                <MaterialIcons name="arrow-back" size={24} color="#f1f5f9" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Meal</Text>
            {addedItems.length > 0 ? (
                <View style={styles.counterBadge}>
                    <Text style={styles.counterText}>{addedItems.length}</Text>
                </View>
            ) : (
                <View style={styles.placeholderButton} />
            )}
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
                <MaterialIcons name="search" size={24} color="rgba(204,255,0,0.6)" style={{ marginRight: 8 }} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search food"
                    placeholderTextColor="rgba(204,255,0,0.4)"
                    value={search}
                    onChangeText={setSearch}
                />
                <TouchableOpacity>
                    <MaterialIcons name="qr-code-scanner" size={24} color="rgba(204,255,0,0.6)" />
                </TouchableOpacity>
            </View>
        </View>

        {/* Category Tabs */}
        <View style={{ height: 50 }}>
            {loading ? (
                <View style={{ paddingLeft: 16, justifyContent: 'center' }}>
                    <ActivityIndicator size="small" color={PRIMARY} />
                </View>
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            onPress={() => setActiveCategory(cat)}
                            style={[
                                styles.tabButton,
                                activeCategory === cat ? styles.tabButtonActive : styles.tabButtonInactive
                            ]}
                        >
                            <Text style={[
                                styles.tabText,
                                activeCategory === cat ? styles.tabTextActive : styles.tabTextInactive
                            ]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
      </View>

      {/* Content Section */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
         {loading ? (
             <View style={{ padding: 20, alignItems: 'center' }}>
                 <ActivityIndicator size="large" color={PRIMARY} />
                 <Text style={{ color: 'rgba(255,255,255,0.5)', marginTop: 10 }}>Loading foods...</Text>
             </View>
         ) : (
            <View style={styles.mealsList}>
                {getFilteredFoods().map((food: any) => (
                    <MealItem 
                        key={food.id} 
                        name={food.name || 'Unknown Food'}
                        detail={`${food.measureType || ''} • ${food.calories || 0} kcal`}
                        imageUrl={food.image}
                        onAdd={handleAdd} 
                        data={food}
                    />
                ))}
                {getFilteredFoods().length === 0 && (
                    <Text style={styles.emptyText}>No foods found for this category</Text>
                )}
            </View>
         )}
      </ScrollView>

      {/* Fixed Footer Action */}
      <View style={styles.footer}>
        <TouchableOpacity 
            style={styles.customMealButton} 
            activeOpacity={0.9}
            onPress={() => router.push('/screens/AddCustomMealScreen')}
        >
            <MaterialIcons name="add-circle" size={24} color="#1f230f" />
            <Text style={styles.customMealText}>Add Custom Meal</Text>
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
    backgroundColor: 'rgba(31,35,15,0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(204,255,0,0.1)',
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(204,255,0,0.1)', // hover effect simulation
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1f5f9',
    flex: 1,
    textAlign: 'center',
  },
  counterBadge: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(204,255,0,0.2)',
  },
  counterText: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: 'bold',
  },
  placeholderButton: {
    width: 40,
    height: 40,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(204,255,0,0.1)',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  searchInput: {
    flex: 1,
    color: '#f1f5f9',
    fontSize: 16,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  tabButton: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: PRIMARY,
  },
  tabButtonInactive: {
    backgroundColor: 'rgba(204,255,0,0.1)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#1f230f',
  },
  tabTextInactive: {
    color: PRIMARY,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // space for footer
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  mealsList: {
    gap: 12,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  mealLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  mealIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(204,255,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mealImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  mealDetail: {
    fontSize: 14,
    color: 'rgba(204,255,0,0.6)',
    marginTop: 2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonNormal: {
    backgroundColor: PRIMARY,
  },
  addButtonAdded: {
    backgroundColor: '#4ade80', // green-400
    transform: [{ scale: 1.1 }],
  },
  emptyText: {
    color: 'rgba(204,255,0,0.4)',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingTop: 32,
    backgroundColor: 'rgba(31,35,15,0.9)', // gradient simulation
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  customMealButton: {
    width: '100%',
    height: 56,
    backgroundColor: PRIMARY,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  customMealText: {
    color: '#1f230f',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
