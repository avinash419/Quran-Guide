
import { Surah, Ayah, QuranResponse } from '../types';

const BASE_URL = 'https://api.alquran.cloud/v1';

export const fetchSurahList = async (): Promise<Surah[]> => {
  const response = await fetch(`${BASE_URL}/surah`);
  const data: QuranResponse<Surah[]> = await response.json();
  return data.data;
};

export const fetchSurahDetails = async (surahNumber: number): Promise<{ ayahs: Ayah[], translation: Ayah[] }> => {
  const [arabicRes, hindiRes] = await Promise.all([
    fetch(`${BASE_URL}/surah/${surahNumber}`),
    fetch(`${BASE_URL}/surah/${surahNumber}/hi.hindi`)
  ]);

  const arabicData: QuranResponse<{ ayahs: Ayah[] }> = await arabicRes.json();
  const hindiData: QuranResponse<{ ayahs: Ayah[] }> = await hindiRes.json();

  return {
    ayahs: arabicData.data.ayahs,
    translation: hindiData.data.ayahs
  };
};

export const fetchRandomAyah = async (): Promise<{ arabic: string, hindi: string, reference: string }> => {
  const random = Math.floor(Math.random() * 6236) + 1;
  const [arabicRes, hindiRes] = await Promise.all([
    fetch(`${BASE_URL}/ayah/${random}`),
    fetch(`${BASE_URL}/ayah/${random}/hi.hindi`)
  ]);

  const arabicData = await arabicRes.json();
  const hindiData = await hindiRes.json();

  return {
    arabic: arabicData.data.text,
    hindi: hindiData.data.text,
    reference: `${arabicData.data.surah.englishName} (${arabicData.data.surah.number}:${arabicData.data.numberInSurah})`
  };
};

export const getAudioUrl = (ayahNumber: number): string => {
  // Use a reliable audio CDN. Padded with leading zeros if necessary
  // format: https://audio.qurancdn.com/Alafasy/mp3/001001.mp3 is often broken.
  // Using AlQuran.cloud global audio endpoint:
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahNumber}.mp3`;
};
