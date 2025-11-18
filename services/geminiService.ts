import { GoogleGenAI, Type } from "@google/genai";
import { UserData, PredictionType, PredictionResult, PlanetPosition } from '../types';

const cleanResponse = (text: string): string => {
  // Remove Markdown code block syntax if present
  return text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
};

export const generateHoroscope = async (
  userData: UserData, 
  type: PredictionType,
  currentPlanets: PlanetPosition[]
): Promise<PredictionResult> => {
  
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Create a simplified string of current astronomical data to ground the model
  const astroContext = currentPlanets.map(p => 
    `${p.name} is at approx ${p.angle.toFixed(1)} degrees heliocentric longitude.`
  ).join('\n');

  const prompt = `
    Act as a friendly, expert astrologer who translates complex real-time astronomical data into simple, easy-to-understand advice for everyday people.
    
    Subject Data:
    Name: ${userData.name}
    Birth Date: ${userData.birthDate}
    Birth Time: ${userData.birthTime}
    Birth Place: ${userData.birthPlace}

    Current Scientific Planetary Positions (Heliocentric):
    ${astroContext}

    Question Topic: ${type}

    Your Task:
    1. Calculate the user's natal chart based on their birth data.
    2. Compare it with the real-time planetary positions provided above.
    3. Identify the most important interaction (transit) happening right now.
    4. Write a prediction that is clear, relatable, and free of confusing jargon.

    Tone Guidelines:
    - SIMPLE & CLEAR: Avoid complex words like "perturbations", "quantum", or "heliocentric" in the final output. 
    - EXPLAIN JARGON: If you must use a term like "Retrograde" or "Square", explain it simply (e.g., "a time of delay" or "a tension point").
    - WARM & HELPFUL: Be encouraging. Focus on actionable advice for the user's daily life.

    Output Requirements:
    Return ONLY valid JSON adhering to this schema.
    
    JSON Schema:
    {
      "astronomyContext": "A simple, one-sentence summary of where a key planet is right now (e.g., 'Mars is moving close to Jupiter today.').",
      "astrologyInsight": "A beginner-friendly explanation of what this means (e.g., 'This brings a boost of energy to your communication skills.').",
      "prediction": "A straightforward paragraph telling the user what to expect and what they should do. Use plain English.",
      "powerDates": ["Date 1", "Date 2", "Date 3"],
      "luckyElement": "A simple symbol or object (e.g., 'The Color Blue', 'Oak Tree', 'Silver')."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            astronomyContext: { type: Type.STRING },
            astrologyInsight: { type: Type.STRING },
            prediction: { type: Type.STRING },
            powerDates: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            luckyElement: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Oracle");

    // Parse manually to ensure safety, though schema enforces it largely
    const parsed = JSON.parse(cleanResponse(text)) as PredictionResult;
    return parsed;

  } catch (error) {
    console.error("Gemini Oracle Error:", error);
    throw new Error("The cosmic link was interrupted. Please try again.");
  }
};