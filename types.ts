
export type ActiveTab = 'guide' | 'analyzer' | 'dashboard' | 'journal' | 'recipes';
export type AnalyzerMode = 'product' | 'meal' | 'recipe' | 'menu';

export interface DietaryProfile {
  allergies: string[];
  preferences: string[];
  calorieGoal?: number;
  proteinGoal?: number;
  carbGoal?: number;
  fatGoal?: number;
  // Biometrics for BMR Calculation
  age?: number;
  gender?: 'male' | 'female';
  weight?: number; // kg
  height?: number; // cm
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

export interface ShoppingItem {
    id: string;
    name: string;
    checked: boolean;
}

export interface PersonalizedAnalysisResult {
    verdict: 'RECOMANDAT' | 'CU PRECAUȚIE' | 'NERECOMANDAT';
    summary: string;
    pros: string[];
    cons: string[];
}

export type FoodTierName = 'TOP' | 'A' | 'B' | 'C' | 'D' | 'E';

export interface FoodTags {
  regions?: string[];
  benefitsForOrgans?: string[];
  dietaryCompatibility?: string[];
  nutritionalProfile?: string[];
}

export interface FoodItem {
  id?: string;
  name: string;
  tier: FoodTierName;
  info: string;
  cons?: string;
  isCustom?: boolean;
  tags?: FoodTags;
}

export interface FoodTier {
  name: FoodTierName;
  foods: FoodItem[];
}

export interface FoodSubcategory {
  name: string;
  tiers: FoodTier[];
}

export interface FoodCategory {
  name: string;
  icon: string;
  color: string;
  subcategories: FoodSubcategory[];
}

export interface Product {
    code: string;
    product_name?: string;
    product_name_ro?: string;
    brands?: string;
    image_url?: string;
    image_small_url?: string;
    image_front_url?: string;
    ingredients_text_ro?: string;
    ingredients_text?: string;
    ingredients_text_with_allergens?: string;
    quantity?: string;
    categories?: string;
    labels?: string;
    stores?: string;
    countries?: string;
    manufacturing_places?: string;
    nutriments?: {
        'energy-kcal_100g'?: number;
        'energy_100g'?: number;
        'sugars_100g'?: number;
        'fat_100g'?: number;
        'saturated-fat_100g'?: number;
        'proteins_100g'?: number;
        'salt_100g'?: number;
        'carbohydrates_100g'?: number;
        'fiber_100g'?: number;
        // Serving values
        'energy-kcal_serving'?: number;
        'energy_serving'?: number;
        'fat_serving'?: number;
        'saturated-fat_serving'?: number;
        'sugars_serving'?: number;
        'salt_serving'?: number;
        'proteins_serving'?: number;
        'carbohydrates_serving'?: number;
        'fiber_serving'?: number;
    };
    allergens_tags?: string[];
    additives_tags?: string[];
    traces_tags?: string[];
    nutriscore_grade?: string;
    nova_group?: number | string;
    nutrient_levels?: {
        fat?: 'low' | 'moderate' | 'high';
        salt?: 'low' | 'moderate' | 'high';
        'saturated-fat'?: 'low' | 'moderate' | 'high';
        sugars?: 'low' | 'moderate' | 'high';
    };
    ecoscore_grade?: string;
    ecoscore_data?: { grade?: string };
    packaging?: string;
    serving_size?: string;
    serving_quantity?: string;
    ingredients_analysis_tags?: string[];
    isCosmetic?: boolean;
}

export interface HistoryItem {
    barcode: string;
    name?: string;
    image?: string;
}

export interface AiModalData {
  title: string;
  icon: string;
  content: string | null; // null when loading
  isLoading: boolean;
  isStreaming?: boolean;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface ComparisonResult {
    summary: string;
    healthierOption: 'produsul 1' | 'produsul 2' | 'niciunul';
    recommendationReason: string;
    product1_pros: string[];
    product1_cons: string[];
    product2_pros: string[];
    product2_cons: string[];
}

// --- New Types for Journal ---

export interface MealNutrients {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface LoggedMeal {
    id: string;
    photoBase64?: string;
    analysisText: string;
    nutrients: MealNutrients;
    timestamp: number;
}

export interface DailyLog {
    [date: string]: LoggedMeal[]; // key is YYYY-MM-DD
}

export interface WaterLog {
    [date: string]: number; // key is YYYY-MM-DD, value is ml
}

export interface MealAnalysis {
    analysisText: string;
    nutrients: MealNutrients;
}