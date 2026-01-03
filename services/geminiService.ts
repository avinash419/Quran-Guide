
import { GoogleGenAI, Type } from "@google/genai";
import { Emotion, GuidanceResult } from "../types";

const getApiKey = () => {
  try {
    return process.env.API_KEY;
  } catch (e) {
    console.warn("API_KEY environment variable not accessible.");
    return null;
  }
};

export const getSpiritualGuidance = async (emotion: Emotion): Promise<GuidanceResult> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key not configured");

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
            ayahArabic: { type: Type.STRING },
            ayahHindi: { type: Type.STRING },
            reflection: { type: Type.STRING },
            reference: { type: Type.STRING }
          },
          required: ["ayahArabic", "ayahHindi", "reflection", "reference"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Guidance Error:", error);
    throw new Error("कुछ तकनीकी समस्या आई है।");
  }
};

export const getAyahReflection = async (arabic: string, hindi: string, surah: string, ayahNum: number): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key not configured");

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Quran Surah ${surah}, Ayah ${ayahNum} ka Arabic text: "${arabic}" aur Hindi anuvad: "${hindi}" hai. 
  Is Ayah ka ek gehri ruhanai chintan (spiritual reflection) Hindi mein likhein jo insan ke dil ko sukoon de aur usey zindagi mein amal karne ki prerna de. 
  Sirf 2-3 bade sentence likhein. Shuddh aur saral Hindi ka prayog karein. 
  Dhyan rahe ki aapka vyavhar ek buzurg ya ruhanai ustad jaisa ho, kisi machine ya AI jaisa nahi.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text?.trim() || "क्षमा करें, चिंतन उत्पन्न नहीं किया जा सका।";
  } catch (error) {
    console.error("Reflection Error:", error);
    return "तकनीकी समस्या के कारण चिंतन उपलब्ध नहीं है।";
  }
};
