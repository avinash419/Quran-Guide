
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  translation?: string;
  audio?: string;
}

export interface QuranResponse<T> {
  code: number;
  status: string;
  data: T;
}

export enum AppSection {
  HOME = 'home',
  SURAH_LIST = 'surah_list',
  READER = 'reader',
  SITUATIONS = 'situations',
}

export enum Emotion {
  STRESS = 'Stress & Anxiety',
  PATIENCE = 'Patience (Sabr)',
  FEAR = 'Fear or Confusion',
  SADNESS = 'Loss or Sadness',
  HOPE = 'Hope & Motivation',
}

export interface GuidanceResult {
  ayahArabic: string;
  ayahHindi: string;
  reflection: string;
  reference: string;
}
