
import { GoogleGenAI, Type } from "@google/genai";
import { Emotion, GuidanceResult } from "../types";

const getApiKey = () => {
  try {
    // Attempt to access process.env safely
    return process.env.API_KEY;
  } catch (e) {
    console.warn("API_KEY environment variable not accessible.");
    return null;
  }
};

export const getSpiritualGuidance = async (emotion: Emotion): Promise<GuidanceResult> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error("Guidance service unavailable: API key not configured. Please check your deployment environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Provide a relevant Quranic Ayah and a short reflection for someone experiencing ${emotion}. 
  The response must be in Hindi for the reflection and translation. 
  The Ayah must be authentic from the Quran.`;

  try {
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

    if (!response || !response.text) {
      throw new Error("Received empty response from the guidance service.");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Spiritual Guidance Error:", error);
    throw new Error("कुछ तकनीकी समस्या आई है। कृपया बाद में पुनः प्रयास करें।");
  }
};
