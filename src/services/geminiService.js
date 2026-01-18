import { GoogleGenAI } from '@google/genai';

// 1. Initialize the client
const ai = new GoogleGenAI({
  // apiKey: 'AIzaSyDmAcZiMqyEoXFh0V3t4_k1ZikCe2Rs1kE',
  apiKey: 'AIzaSyA6FHSc_Usc2kn_A3Iwh2cdz_Q4irO1oME',
});

/**
 * Updated Service using the default @google/genai SDK
 */
export const getGeminiResponse = async (
  prompt,
  modelName = 'gemini-3-flash-preview',
  // modelName = 'gemini-2.0-flash',
) => {
  try {
    // 2. The new SDK calls generateContent through the models object
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    // 3. Return the text directly (the new SDK simplifies the response object)
    return response.text;
  } catch (error) {
    console.error(`Gemini Service Error (${modelName}):`, error);
    throw error;
  }
};
