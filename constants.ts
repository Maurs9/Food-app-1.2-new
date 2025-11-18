import { FoodTags } from './types';

export const FILTER_OPTIONS: Record<keyof FoodTags, { label: string, options: string[] }> = {
  regions: {
    label: 'Zonă Geografică',
    options: ['Europa', 'Asia', 'America de Nord', 'America de Sud', 'Africa', 'Global']
  },
  benefitsForOrgans: {
    label: 'Beneficii pentru Sănătate',
    options: ['Creier', 'Inimă', 'Ochi', 'Piele', 'Sistem Digestiv', 'Oase', 'Imunitate', 'Mușchi']
  },
  dietaryCompatibility: {
    label: 'Compatibilitate Dietetică',
    options: ['Vegetarian', 'Vegan', 'Fără Gluten']
  },
  nutritionalProfile: {
    label: 'Profil Nutrițional',
    options: ['Bogat în Proteine', 'Bogat în Fibre', 'Sărac în Calorii', 'Grăsimi Sănătoase', 'Bogat în Omega-3', 'Bogat în Antioxidanți']
  }
};