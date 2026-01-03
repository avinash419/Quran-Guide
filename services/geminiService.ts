
import { GoogleGenAI, Type } from "@google/genai";
import { Emotion, GuidanceResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSpiritualGuidance = async (emotion: Emotion): Promise<GuidanceResult> => {
  const prompt = `Provide a relevant Quranic Ayah and a short reflection for someone experiencing ${emotion}. 
  The response must be in Hindi for the reflection and translation. 
  The Ayah must be authentic from the Quran.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ayahArabic: { type: Type.STRING, description: "The original Arabic text of the Ayah." },
          ayahHindi: { type: Type.STRING, description: "The Hindi translation of the Ayah." },
          reflection: { type: Type.STRING, description: "A short, 2-3 sentence reflection/explanation in Hindi relating the Ayah to the emotion." },
          reference: { type: Type.STRING, description: "The Surah name and Ayah number (e.g., Al-Baqarah 2:153)." }
        },
        required: ["ayahArabic", "ayahHindi", "reflection", "reference"]
      }
    }
  });

  return JSON.parse(response.text);
};
