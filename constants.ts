
import { Emotion } from './types';

export const EMOTIONS = [
  { id: Emotion.STRESS, label: 'तनाव और चिंता', icon: '🌊', color: 'bg-blue-50' },
  { id: Emotion.PATIENCE, label: 'धैर्य (सब्र)', icon: '⏳', color: 'bg-emerald-50' },
  { id: Emotion.FEAR, label: 'डर या भ्रम', icon: '🕯️', color: 'bg-amber-50' },
  { id: Emotion.SADNESS, label: 'दुःख या उदासी', icon: '🌧️', color: 'bg-indigo-50' },
  { id: Emotion.HOPE, label: 'आशा और प्रेरणा', icon: '✨', color: 'bg-yellow-50' },
];

export const COLORS = {
  primary: '#15803d', // green-700
  secondary: '#fef3c7', // amber-100
  accent: '#064e3b', // emerald-900
};
