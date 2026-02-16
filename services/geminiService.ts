
import { GoogleGenAI, Type } from "@google/genai";
import { TripPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateItinerary = async (destination: string, duration: number): Promise<Partial<TripPlan>> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `請幫我規劃一個前往 ${destination} 的 ${duration} 天行程。
    請以繁體中文回傳 JSON 格式。
    
    需求：
    1. 提供一個 50 字內的「行程概要 (summary)」。
    2. 提供該地當前季節的「天氣概況 (weatherOverview)」。
    3. 為每一天提供預計的天氣資訊 (weather: {temp, condition})。
    4. 推薦 5 個當地的必買清單 (recommendedShoppingItems: string[])。
    5. 對於每個景點，提供一個英文搜尋關鍵字 (searchQuery) 用於尋找圖片。`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          weatherOverview: { type: Type.STRING },
          recommendedShoppingItems: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.INTEGER },
                weather: {
                  type: Type.OBJECT,
                  properties: {
                    temp: { type: Type.STRING },
                    condition: { type: Type.STRING }
                  },
                  required: ["temp", "condition"]
                },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      location: { type: Type.STRING },
                      description: { type: Type.STRING },
                      searchQuery: { type: Type.STRING }
                    },
                    required: ["time", "location", "description", "searchQuery"]
                  }
                }
              },
              required: ["day", "items", "weather"]
            }
          }
        },
        required: ["title", "summary", "weatherOverview", "days", "recommendedShoppingItems"]
      }
    }
  });

  return JSON.parse(response.text);
};
